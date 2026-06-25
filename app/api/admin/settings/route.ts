import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function checkAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  if (token === DEFAULT_PASSWORD) return true;
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'admin_password').maybeSingle();
  return !!(data?.value && token === data.value);
}

export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .order('key');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  data?.forEach((item) => {
    settings[item.key] = item.value || '';
  });

  return NextResponse.json({ settings });
}

export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { key, value: value || '', updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value || ''),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
