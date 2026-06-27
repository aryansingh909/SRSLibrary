import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function checkAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  if (token === DEFAULT_PASSWORD) return true;
  const { data } = await supabaseAdmin.from('site_settings').select('value').eq('key', 'admin_password').maybeSingle();
  return !!(data?.value && token === data.value);
}

export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';

  const results: Record<string, unknown[]> = {};

  if (type === 'all' || type === 'enquiries') {
    const { data, error } = await supabaseAdmin
      .from('degree_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    results.enquiries = data || [];
  }

  if (type === 'all' || type === 'contacts') {
    const { data, error } = await supabaseAdmin
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    results.contacts = data || [];
  }

  if (type === 'all' || type === 'memberships') {
    const { data, error } = await supabaseAdmin
      .from('library_memberships')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    results.memberships = data || [];
  }

  return NextResponse.json(results);
}

export async function PUT(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let table = '';
    if (type === 'enquiry') table = 'degree_enquiries';
    else if (type === 'contact') table = 'contact_requests';
    else if (type === 'membership') table = 'library_memberships';
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from(table)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, record: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) {
    return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 });
  }

  let table = '';
  if (type === 'enquiry') table = 'degree_enquiries';
  else if (type === 'contact') table = 'contact_requests';
  else if (type === 'membership') table = 'library_memberships';
  else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
