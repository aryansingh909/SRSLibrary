import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Session configuration
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_COOKIE_NAME = 'portal_session';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

// In-memory rate limiting (per-instance, acceptable for brute force protection)
const loginAttempts = new Map<string, LoginAttempt>();

export async function getPortalPassword(): Promise<string> {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'portal_password')
    .maybeSingle();

  return data?.value || process.env.PORTAL_PASSWORD || 'library2024';
}

export async function setPortalPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({
      key: 'portal_password',
      value: newPassword,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    return { allowed: false, lockedUntil: attempt.lockedUntil };
  }

  if (attempt.lockedUntil && now >= attempt.lockedUntil) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  if (now - attempt.firstAttempt > LOCKOUT_DURATION_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempt.count };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else if (attempt.lockedUntil && now < attempt.lockedUntil) {
    return;
  } else {
    attempt.count++;
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.lockedUntil = now + LOCKOUT_DURATION_MS;
    }
  }
}

export function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// Database-backed session storage (works in serverless)
export async function createSession(ip?: string): Promise<{ token: string; expiresAt: number }> {
  const now = Date.now();
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const expiresAt = now + SESSION_DURATION_MS;

  const { error } = await supabaseAdmin
    .from('portal_sessions')
    .insert({
      token,
      expires_at: new Date(expiresAt).toISOString(),
      ip: ip || null,
    });

  if (error) {
    console.error('[Portal Auth] Failed to create session:', error.message);
  }

  return { token, expiresAt };
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false;

  const { data, error } = await supabaseAdmin
    .from('portal_sessions')
    .select('expires_at')
    .eq('token', token)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  const expiresAt = new Date(data.expires_at).getTime();
  if (Date.now() > expiresAt) {
    // Expired - clean up
    await supabaseAdmin.from('portal_sessions').delete().eq('token', token);
    return false;
  }

  return true;
}

export async function endSession(token: string): Promise<void> {
  if (!token) return;
  await supabaseAdmin.from('portal_sessions').delete().eq('token', token);
}

export async function extendSession(token: string): Promise<number | null> {
  if (!token) return null;

  const newExpiresAt = Date.now() + SESSION_DURATION_MS;

  const { error } = await supabaseAdmin
    .from('portal_sessions')
    .update({ expires_at: new Date(newExpiresAt).toISOString() })
    .eq('token', token);

  if (error) return null;

  return newExpiresAt;
}

export async function authenticatePortal(password: string, ip: string): Promise<{ success: boolean; error?: string; token?: string }> {
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const remainingMinutes = Math.ceil(((rateCheck.lockedUntil || 0) - Date.now()) / 60000);
    return { success: false, error: `Too many failed attempts. Try again in ${remainingMinutes} minutes.` };
  }

  const storedPassword = await getPortalPassword();

  if (password !== storedPassword) {
    recordFailedAttempt(ip);
    return { success: false, error: 'Invalid credentials' };
  }

  clearAttempts(ip);
  const { token } = await createSession(ip);

  return { success: true, token };
}

export async function checkPortalAuth(request: NextRequest): Promise<{ authorized: boolean; token?: string }> {
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.replace('Bearer ', '');

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const token = headerToken || cookieToken;

  if (!token) {
    return { authorized: false };
  }

  const valid = await validateSession(token);
  return { authorized: valid, token: valid ? token : undefined };
}

export { supabaseAdmin };
