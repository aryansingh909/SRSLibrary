import { NextRequest, NextResponse } from 'next/server';
import { authenticatePortal, checkPortalAuth, endSession } from '@/lib/portal-auth';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const ip = getClientIP(request);
    const result = await authenticatePortal(password, ip);

    if (result.success && result.token) {
      const response = NextResponse.json({ success: true, token: result.token });
      response.cookies.set('portal_session', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1800, // 30 minutes
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: result.error || 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await checkPortalAuth(request);

  if (auth.authorized) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE(request: NextRequest) {
  const auth = await checkPortalAuth(request);

  if (auth.token) {
    await endSession(auth.token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('portal_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
