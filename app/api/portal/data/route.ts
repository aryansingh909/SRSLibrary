import { NextRequest, NextResponse } from 'next/server';
import { checkPortalAuth, supabaseAdmin } from '@/lib/portal-auth';

export async function GET(request: NextRequest) {
  const auth = await checkPortalAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';

  try {
    const results: Record<string, unknown> = {};

    // Dashboard stats
    if (type === 'stats' || type === 'all') {
      const [memberships, enquiries, contacts] = await Promise.all([
        supabaseAdmin.from('library_memberships').select('id, status', { count: 'exact', head: false }),
        supabaseAdmin.from('degree_enquiries').select('id, status', { count: 'exact', head: false }),
        supabaseAdmin.from('contact_requests').select('id, status', { count: 'exact', head: false }),
      ]);

      results.stats = {
        totalMemberships: memberships.count || 0,
        activeMemberships: memberships.data?.filter(m => m.status === 'active').length || 0,
        pendingMemberships: memberships.data?.filter(m => m.status === 'pending').length || 0,
        totalEnquiries: enquiries.count || 0,
        newEnquiries: enquiries.data?.filter(e => e.status === 'new').length || 0,
        totalContacts: contacts.count || 0,
        unreadContacts: contacts.data?.filter(c => c.status === 'new').length || 0,
      };
    }

    // Full data for each type
    if (type === 'all' || type === 'memberships') {
      const { data, error } = await supabaseAdmin
        .from('library_memberships')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      results.memberships = data;
    }

    if (type === 'all' || type === 'enquiries') {
      const { data, error } = await supabaseAdmin
        .from('degree_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      results.enquiries = data;
    }

    if (type === 'all' || type === 'contacts') {
      const { data, error } = await supabaseAdmin
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      results.contacts = data;
    }

    // Recent activity
    if (type === 'recent' || type === 'all') {
      const [recentMemberships, recentEnquiries, recentContacts] = await Promise.all([
        supabaseAdmin.from('library_memberships').select('*').order('created_at', { ascending: false }).limit(5),
        supabaseAdmin.from('degree_enquiries').select('*').order('created_at', { ascending: false }).limit(5),
        supabaseAdmin.from('contact_requests').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const activities = [
        ...(recentMemberships.data || []).map((m) => ({ type: 'membership', data: m, created_at: m.created_at })),
        ...(recentEnquiries.data || []).map((e) => ({ type: 'enquiry', data: e, created_at: e.created_at })),
        ...(recentContacts.data || []).map((c) => ({ type: 'contact', data: c, created_at: c.created_at })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

      results.recent = activities;
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error('[Portal Data] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await checkPortalAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tableMap: Record<string, string> = {
      membership: 'library_memberships',
      enquiry: 'degree_enquiries',
      contact: 'contact_requests'
    };

    const table = tableMap[type];
    if (!table) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from(table)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await checkPortalAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) {
    return NextResponse.json({ error: 'Type and ID required' }, { status: 400 });
  }

  const tableMap: Record<string, string> = {
    membership: 'library_memberships',
    enquiry: 'degree_enquiries',
    contact: 'contact_requests'
  };

  const table = tableMap[type];
  if (!table) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
