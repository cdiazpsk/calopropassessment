import { NextResponse } from 'next/server';
import { serviceSupabase } from '../../../lib/supabase';
export async function DELETE(req) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing assessment id.' }, { status: 400 });
  const s = serviceSupabase();
  const { data: files } = await s.from('assessment_files').select('file_path').eq('assessment_id', id);
  const filePaths = (files || []).map(f => f.file_path).filter(Boolean);
  if (filePaths.length) await s.storage.from('assessment-media').remove(filePaths);
  await s.from('assessment_files').delete().eq('assessment_id', id);
  const { error } = await s.from('assessments').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
