import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, course, qualification, message } = body;

    if (!name || !email || !phone || !course) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const VALID_COURSES = ['BCA', 'BBA', 'BA', 'MBA', 'MA', 'M.Com'];
    if (!VALID_COURSES.includes(course)) {
      return NextResponse.json({ error: 'Invalid course' }, { status: 400 });
    }

    const { data, error } = await supabase.from('degree_enquiries').insert({
      name,
      email,
      phone,
      course,
      qualification: qualification || null,
      message: message || null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('notifications').insert({
      type: 'enquiry',
      title: `New enquiry: ${name} for ${course}`,
      body: `Phone: ${phone}`,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
