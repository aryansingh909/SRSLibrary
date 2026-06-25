import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, plan } = body;

    if (!name || !email || !phone || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const VALID_PLANS = ['daily', 'weekly', 'monthly', 'quarterly'];
    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const PLAN_AMOUNTS: Record<string, number> = {
      daily: 49,
      weekly: 249,
      monthly: 799,
      quarterly: 1999,
    };

    const { data, error } = await supabase.from('library_memberships').insert({
      name,
      email,
      phone,
      plan,
      amount: PLAN_AMOUNTS[plan],
      payment_status: 'pending',
      status: 'active',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('notifications').insert({
      type: 'membership',
      title: `New membership: ${name} (${plan})`,
      body: `Phone: ${phone}, Email: ${email}`,
    });

    return NextResponse.json({ success: true, id: data.id, amount: PLAN_AMOUNTS[plan] });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
