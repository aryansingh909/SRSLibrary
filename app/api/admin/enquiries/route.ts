import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, supabaseAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authResult = await checkAuth(request);
  if (!authResult.authorized) {
    console.log('[GET] Auth failed:', authResult.error);
    return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
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
  const authResult = await checkAuth(request);
  if (!authResult.authorized) {
    console.log('[PUT] Auth failed:', authResult.error);
    return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
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

    console.log(`[PUT] Updating ${table} id=${id} to status=${status}`);

    const updateData: Record<string, string> = { status };
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`[PUT] Error updating ${table}:`, error);
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }

    console.log(`[PUT] Successfully updated ${table}:`, data);
    return NextResponse.json({ success: true, record: data });
  } catch (err) {
    console.error('[PUT] Exception:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await checkAuth(request);
  if (!authResult.authorized) {
    console.log('[DELETE] Auth failed:', authResult.error);
    return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 });
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

  console.log(`[DELETE] Deleting from ${table} id=${id}`);

  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);

  if (error) {
    console.error(`[DELETE] Error deleting from ${table}:`, error);
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  console.log(`[DELETE] Successfully deleted from ${table}`);
  return NextResponse.json({ success: true });
}
