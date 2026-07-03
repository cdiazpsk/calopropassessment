import { NextResponse } from 'next/server';
import { serviceSupabase } from '../../../lib/supabase';
export async function POST(req) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing assessment id.' }, { status: 400 });
  const s = serviceSupabase();
  const { error } = await s.from('assessments').update({ status: 'archived' }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
