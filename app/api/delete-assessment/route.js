import { NextResponse } from 'next/server';
import { serviceSupabase } from '../../../lib/supabase';

export async function DELETE(req) {
  const id = new URL(req.url).searchParams.get('id');

  const s = serviceSupabase();

  // Delete uploaded files first
  await s
    .from('assessment_files')
    .delete()
    .eq('assessment_id', id);

  // Delete assessment
  const { error } = await s
    .from('assessments')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
