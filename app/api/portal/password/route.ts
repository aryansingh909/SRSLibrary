import { NextRequest, NextResponse } from 'next/server';
import { checkPortalAuth, getPortalPassword, setPortalPassword } from '@/lib/portal-auth';

export async function POST(request: NextRequest) {
  const auth = await checkPortalAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Verify current password
    const storedPassword = await getPortalPassword();
    if (currentPassword !== storedPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Update password
    const result = await setPortalPassword(newPassword);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
