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

interface Session {
  createdAt: number;
  expiresAt: number;
}

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

// In-memory rate limiting (resets on server restart)
const loginAttempts = new Map<string, LoginAttempt>();

export function hashPassword(password: string): string {
  // Simple hash for demonstration - in production use bcrypt
  return Buffer.from(password).toString('base64');
}

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

  // Check if locked out
  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    return { allowed: false, lockedUntil: attempt.lockedUntil };
  }

  // Reset if lockout expired
  if (attempt.lockedUntil && now >= attempt.lockedUntil) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  // Reset if outside window
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
    // Already locked, don't increment
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

export function createSession(): { token: string; expiresAt: number } {
  const now = Date.now();
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const expiresAt = now + SESSION_DURATION_MS;

  // Store session (in production, use Redis or database)
  sessions.set(token, { createdAt: now, expiresAt });

  return { token, expiresAt };
}

// In-memory sessions (resets on server restart)
const sessions = new Map<string, Session>();

export function validateSession(token: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;

  const now = Date.now();
  if (now > session.expiresAt) {
    sessions.delete(token);
    return false;
  }

  return true;
}

export function endSession(token: string): void {
  sessions.delete(token);
}

export function extendSession(token: string): number | null {
  const session = sessions.get(token);
  if (!session) return null;

  const now = Date.now();
  if (now > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  const newExpiresAt = now + SESSION_DURATION_MS;
  session.expiresAt = newExpiresAt;

  return newExpiresAt;
}

export async function authenticatePortal(password: string, ip: string): Promise<{ success: boolean; error?: string; token?: string }> {
  // Check rate limit
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const remainingMinutes = Math.ceil(((rateCheck.lockedUntil || 0) - Date.now()) / 60000);
    return { success: false, error: `Too many failed attempts. Try again in ${remainingMinutes} minutes.` };
  }

  // Get stored password
  const storedPassword = await getPortalPassword();

  // Validate password
  if (password !== storedPassword) {
    recordFailedAttempt(ip);
    return { success: false, error: 'Invalid credentials' };
  }

  // Success - clear rate limit and create session
  clearAttempts(ip);
  const { token } = createSession();

  return { success: true, token };
}

export async function checkPortalAuth(request: NextRequest): Promise<{ authorized: boolean; token?: string }> {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.replace('Bearer ', '');

  // Check cookie as fallback
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const token = headerToken || cookieToken;

  if (!token) {
    return { authorized: false };
  }

  const valid = validateSession(token);
  return { authorized: valid, token: valid ? token : undefined };
}

export { supabaseAdmin };
