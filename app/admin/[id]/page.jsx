import Link from 'next/link';
import Image from 'next/image';
import Header from '../../../components/Header';
import { serviceSupabase } from '../../../lib/supabase';
import RunAiButton from './run-ai-button';

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

  const filesWithUrls = await Promise.all((files || []).map(async file => {
    const { data } = await s.storage
      .from('assessment-media')
      .createSignedUrl(file.file_path, 60 * 60);

    return {
      ...file,
      signed_url: data?.signedUrl || null
    };
  }));

  return { assessment, files: filesWithUrls, error: null };
}

export default async function DetailPage({ params }) {
  const { assessment, files, error } = await getAssessment(params.id);

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
        <div style={{ marginBottom: 24 }}>
          <Link href="/admin" className="btn-secondary">Back to Assessment List</Link>
        </div>

        <Image
          src="/caliber-logo.jpg"
          alt="Caliber Lodging"
          width={300}
          height={65}
          priority
          style={{ height: 'auto', maxWidth: 300, marginBottom: 18 }}
        />

        <p style={{ color: '#0F67B1', fontWeight: 900, letterSpacing: 1 }}>ASSESSMENT REVIEW</p>
        <h1 style={{ color: '#0B2F5B', fontSize: 42, fontWeight: 900, margin: '8px 0 8px' }}>{assessment.property_name}</h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          {assessment.property_category || 'N/A'} | {assessment.brand || 'N/A'} | {assessment.property_city || 'N/A'}, {assessment.property_state || 'N/A'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginBottom: 20 }}>
          <Metric label="Score" value={assessment.readiness_score ? `${assessment.readiness_score}/100` : 'N/A'} />
          <Metric label="Program" value={assessment.recommended_program || 'N/A'} />
          <Metric label="Production" value={assessment.estimated_rooms_per_day ? `${assessment.estimated_rooms_per_day}/day` : 'N/A'} />
          <Metric label="Pricing" value={assessment.recommended_pricing || 'N/A'} />
        </div>

        <section className="card" style={{ padding: 24, marginTop: 20 }}>
          <h2 style={{ color: '#0B2F5B' }}>Submitted Details</h2>
          <DetailGrid assessment={assessment} />
        </section>

        <section className="card" style={{ padding: 24, marginTop: 20 }}>
          <h2 style={{ color: '#0B2F5B' }}>Condition Scores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
            <Metric label="Paint" value={assessment.paint_score || 'N/A'} />
            <Metric label="Caulk" value={assessment.caulk_score || 'N/A'} />
            <Metric label="Furniture" value={assessment.furniture_score || 'N/A'} />
            <Metric label="HVAC" value={assessment.hvac_score || 'N/A'} />
            <Metric label="Plumbing" value={assessment.plumbing_score || 'N/A'} />
            <Metric label="Doors" value={assessment.doors_score || 'N/A'} />
            <Metric label="Logistics" value={assessment.logistics_score || 'N/A'} />
            <Metric label="Room Release" value={assessment.room_release_score || 'N/A'} />
          </div>
        </section>

        <section className="card" style={{ padding: 24, marginTop: 20 }}>
          <h2 style={{ color: '#0B2F5B' }}>AI Assessment</h2>
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
        </section>

        <section className="card" style={{ padding: 24, marginTop: 20 }}>
          <h2 style={{ color: '#0B2F5B' }}>Uploaded Photos and Videos</h2>
          {files.length === 0 && <p style={{ color: '#64748b' }}>No uploaded files found.</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
            {files.map(file => (
              <div key={file.id} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 14, background: '#f8fafc' }}>
                <strong style={{ color: '#0B2F5B' }}>{file.file_label || 'File'}</strong>
                <p style={{ color: '#64748b', fontSize: 13 }}>{file.file_name}</p>

                {file.signed_url && file.file_type?.startsWith('image/') && (
                  <img src={file.signed_url} alt={file.file_label || file.file_name} style={{ width: '100%', borderRadius: 12, marginTop: 10 }} />
                )}

                {file.signed_url && file.file_type?.startsWith('video/') && (
                  <video src={file.signed_url} controls style={{ width: '100%', borderRadius: 12, marginTop: 10 }} />
                )}

                {file.signed_url && (
                  <p style={{ marginTop: 10 }}>
                    <a href={file.signed_url} target="_blank" rel="noreferrer" style={{ color: '#0F67B1', fontWeight: 800 }}>Open File</a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
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
    ['Comp Rooms', assessment.comp_rooms_available ? 'Yes' : 'No'],
    ['Meals Provided', assessment.meals_provided ? 'Yes' : 'No'],
    ['Owner Supplies Materials', assessment.materials_owner_supplied ? 'Yes' : 'No'],
    ['Floor Release', assessment.floor_release_available ? 'Yes' : 'No'],
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
