import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export interface AuthResult {
  authorized: boolean;
  error?: string;
}

export async function checkAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    console.log('[Auth] No authorization header');
    return { authorized: false, error: 'No authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.log('[Auth] No token after parsing');
    return { authorized: false, error: 'No token provided' };
  }

  // Check against default password first (fast path)
  if (token === DEFAULT_PASSWORD) {
    console.log('[Auth] Matched DEFAULT_PASSWORD');
    return { authorized: true };
  }

  // Check against database-stored password
  try {
    console.log('[Auth] Checking database for admin_password...');

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'admin_password')
      .maybeSingle();

    if (error) {
      console.error('[Auth] Database error:', error.message, error.code);
      return { authorized: false, error: `Database error: ${error.message}` };
    }

    console.log('[Auth] Database response:', { hasData: !!data, hasValue: !!data?.value });

    if (data?.value) {
      // Compare strings - both should be strings
      const dbPassword = String(data.value);
      const providedPassword = String(token);

      console.log('[Auth] Comparing passwords:', {
        dbPasswordLength: dbPassword.length,
        providedLength: providedPassword.length,
        match: dbPassword === providedPassword
      });

      if (dbPassword === providedPassword) {
        return { authorized: true };
      }
    }

    return { authorized: false, error: 'Invalid password' };
  } catch (err) {
    console.error('[Auth] Exception:', err);
    return { authorized: false, error: 'Authentication failed' };
  }
}

export { supabaseAdmin };
