import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  data?.forEach((item) => {
    settings[item.key] = item.value || '';
  });

  return NextResponse.json({ settings });
}
