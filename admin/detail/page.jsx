import Link from 'next/link';
import Header from '../../../components/Header';
import { serviceSupabase } from '../../../lib/supabase';
import RunAiButton from '../[id]/run-ai-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAssessment(id) {
  const s = serviceSupabase();

  const { data: assessment, error } = await s
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !assessment) {
    return { assessment: null, files: [], error: error?.message || 'Assessment not found.' };
  }

  const { data: files } = await s
    .from('assessment_files')
    .select('*')
    .eq('assessment_id', id)
    .order('created_at', { ascending: true });

  const signed = await Promise.all((files || []).map(async f => {
    const { data } = await s.storage
      .from('assessment-media')
      .createSignedUrl(f.file_path, 3600);

    return { ...f, signed_url: data?.signedUrl || null };
  }));

  return { assessment, files: signed, error: null };
}

export default async function DetailPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id;

  if (!id || id === 'undefined') {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 980, margin: '0 auto', padding: '36px 20px' }}>
          <Link href="/admin" className="btn-secondary">Back to Assessment List</Link>
          <div className="card" style={{ marginTop: 20, padding: 24, color: '#b42318', fontWeight: 800 }}>
            Invalid assessment link. Please return to the assessment list and select a property.
          </div>
        </main>
      </>
    );
  }

  const { assessment, files, error } = await getAssessment(id);

  if (!assessment) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 980, margin: '0 auto', padding: '36px 20px' }}>
          <Link href="/admin" className="btn-secondary">Back to Assessment List</Link>
          <div className="card" style={{ marginTop: 20, padding: 24, color: '#b42318', fontWeight: 800 }}>
            {error}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 20px 70px' }}>
        <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin" className="btn-secondary">Back to Assessment List</Link>
          <Link href={`/admin/${assessment.id}/proposal`} className="btn-primary">Generate Proposal Draft</Link>
        </div>

        <p className="kicker">Assessment Review</p>
        <h1 className="h1">{assessment.property_name}</h1>
        <p className="muted">
          {assessment.property_category || 'N/A'} | {assessment.brand || 'N/A'} | {assessment.property_city || 'N/A'}, {assessment.property_state || 'N/A'}
        </p>

        <div className="grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14, margin: '20px 0' }}>
          <Metric label="Score" value={assessment.readiness_score ? `${assessment.readiness_score}/100` : 'N/A'} />
          <Metric label="Program" value={assessment.recommended_program || 'N/A'} />
          <Metric label="Production" value={assessment.estimated_rooms_per_day ? `${assessment.estimated_rooms_per_day}/day` : 'N/A'} />
          <Metric label="Pricing" value={assessment.recommended_pricing || 'N/A'} />
        </div>

        <Section title="Submitted Details">
          <DetailGrid assessment={assessment} />
        </Section>

        <Section title="Condition Scores">
          <div className="grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12 }}>
            <Metric label="Paint" value={assessment.paint_score || 'N/A'} />
            <Metric label="Caulk" value={assessment.caulk_score || 'N/A'} />
            <Metric label="Furniture" value={assessment.furniture_score || 'N/A'} />
            <Metric label="HVAC" value={assessment.hvac_score || 'N/A'} />
            <Metric label="Plumbing" value={assessment.plumbing_score || 'N/A'} />
            <Metric label="Doors" value={assessment.doors_score || 'N/A'} />
            <Metric label="Logistics" value={assessment.logistics_score || 'N/A'} />
            <Metric label="Room Release" value={assessment.room_release_score || 'N/A'} />
          </div>
        </Section>

        <Section title="AI Assessment">
          <RunAiButton assessmentId={assessment.id} />
          {assessment.ai_summary && (
            <div style={{ marginTop: 16, background: '#f8fafc', padding: 16, borderRadius: 12 }}>
              <strong>AI Summary</strong>
              <p>{assessment.ai_summary}</p>
              <p><strong>AI Program:</strong> {assessment.ai_recommended_program}</p>
              <p><strong>AI Production:</strong> {assessment.ai_estimated_rooms_per_day}/day</p>
              <p><strong>AI Pricing:</strong> {assessment.ai_recommended_pricing}</p>
              <p><strong>AI Add-ons:</strong> {(assessment.ai_recommended_addons || []).join(', ') || 'N/A'}</p>
              <p><strong>AI Risks:</strong> {(assessment.ai_risks || []).join(', ') || 'N/A'}</p>
              <p><strong>Questions:</strong> {(assessment.ai_questions || []).join(', ') || 'N/A'}</p>
            </div>
          )}
        </Section>

        <Section title="Uploaded Photos and Videos">
          {files.length === 0 && <p className="muted">No uploaded files found.</p>}
          <div className="grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16 }}>
            {files.map(f => (
              <div key={f.id} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 14, background: '#f8fafc' }}>
                <strong style={{ color: '#0B2F5B' }}>{f.file_label || 'File'}</strong>
                <p className="muted" style={{ fontSize: 13 }}>{f.file_name}</p>

                {f.signed_url && f.file_type?.startsWith('image/') && (
                  <img src={f.signed_url} alt={f.file_label || f.file_name} style={{ width: '100%', borderRadius: 12, marginTop: 10 }} />
                )}

                {f.signed_url && f.file_type?.startsWith('video/') && (
                  <video src={f.signed_url} controls style={{ width: '100%', borderRadius: 12, marginTop: 10 }} />
                )}
              </div>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="card" style={{ padding: 24, marginTop: 20 }}>
      <h2 style={{ color: '#0B2F5B' }}>{title}</h2>
      {children}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
      <div style={{ color: '#64748b', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ color: '#0B2F5B', fontSize: 20, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function DetailGrid({ assessment }) {
  const rows = [
    ['Reason', assessment.assessment_reason],
    ['Services', (assessment.service_categories || []).join(', ')],
    ['Management Company', assessment.management_company],
    ['Ownership Group', assessment.owner_company],
    ['Contact', `${assessment.contact_name || 'N/A'} | ${assessment.contact_email || 'N/A'} | ${assessment.contact_phone || 'N/A'}`],
    ['Total Rooms', assessment.total_rooms],
    ['Last Renovated', assessment.last_renovated_year],
    ['Rooms Available Per Day', assessment.rooms_available_per_day],
    ['Comp Rooms Available', assessment.comp_rooms_available ? 'Yes' : 'No'],
    ['Meals Provided', assessment.meals_provided ? 'Yes' : 'No'],
    ['Materials Owner Supplied', assessment.materials_owner_supplied ? 'Yes' : 'No'],
    ['Floor Release Available', assessment.floor_release_available ? 'Yes' : 'No'],
    ['Top Issues', (assessment.top_issues || []).join(', ')],
    ['Room Release Notes', assessment.room_release_notes],
    ['Notes', assessment.notes]
  ];

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
          <strong style={{ color: '#0B2F5B' }}>{label}</strong>
          <span style={{ color: '#475569' }}>{value || 'N/A'}</span>
        </div>
      ))}
    </div>
  );
}
