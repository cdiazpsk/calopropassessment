import Link from 'next/link';
import Header from '../../components/Header';
import { serviceSupabase } from '../../lib/supabase';
import RunAiButton from '../admin/run-ai-button';

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
    const { data } = await s.storage.from('assessment-media').createSignedUrl(f.file_path, 3600);
    return { ...f, signed_url: data?.signedUrl || null };
  }));

  return { assessment, files: signed, error: null };
}

export default async function ReviewPage({ searchParams }) {
  const sp = await searchParams;
  const id = sp?.id;

  const { assessment, files, error } = id
    ? await getAssessment(id)
    : { assessment: null, files: [], error: 'Missing assessment id.' };

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
          <Link href={`/proposal?id=${assessment.id}`} className="btn-primary">Generate Proposal Draft</Link>
        </div>

        <p className="kicker">Assessment Review</p>
        <h1 className="h1">{assessment.property_name}</h1>
        <p className="muted">{assessment.property_category || 'N/A'} | {assessment.brand || 'N/A'} | {assessment.property_city || 'N/A'}, {assessment.property_state || 'N/A'}</p>

        <div className="grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14, margin: '20px 0' }}>
          <Metric label="Score" value={assessment.ai_condition_score ? `${assessment.ai_condition_score}/100` : assessment.readiness_score ? `${assessment.readiness_score}/100` : 'N/A'} />
          <Metric label="Program" value={assessment.ai_recommended_program || assessment.recommended_program || 'N/A'} />
          <Metric label="Production" value={assessment.ai_estimated_rooms_per_day ? `${assessment.ai_estimated_rooms_per_day}/day` : assessment.estimated_rooms_per_day ? `${assessment.estimated_rooms_per_day}/day` : 'N/A'} />
          <Metric label="Pricing" value={assessment.ai_recommended_pricing || assessment.recommended_pricing || 'N/A'} />
        </div>

        <Section title="AI Underwriting">
          <RunAiButton assessmentId={assessment.id} />

          {assessment.ai_summary ? (
            <div style={{ marginTop: 18 }}>
              <h3 style={{ color: '#0B2F5B' }}>Executive Summary</h3>
              <p>{assessment.ai_summary}</p>

              <h3 style={{ color: '#0B2F5B' }}>Property Health Score</h3>
              <HealthScores data={assessment.ai_property_health} />

              <h3 style={{ color: '#0B2F5B' }}>Cost Risk Analysis</h3>
              <RiskList items={assessment.ai_cost_risks} />

              <h3 style={{ color: '#0B2F5B' }}>Profitability Analysis</h3>
              <Profitability data={assessment.ai_profitability_analysis} />

              <h3 style={{ color: '#0B2F5B' }}>Production Analysis</h3>
              <Production data={assessment.ai_production_analysis} />

              <h3 style={{ color: '#0B2F5B' }}>Opportunity Analysis</h3>
              <OpportunityList items={assessment.ai_opportunity_analysis} />

              <h3 style={{ color: '#0B2F5B' }}>Estimated Cost Drivers</h3>
              <CostDrivers items={assessment.ai_cost_drivers} />

              <h3 style={{ color: '#0B2F5B' }}>Operational Recommendations</h3>
              <BulletList items={assessment.ai_operational_recommendations} />

              <h3 style={{ color: '#0B2F5B' }}>Estimate Confidence</h3>
              <Confidence data={assessment.ai_estimate_confidence} />

              <h3 style={{ color: '#0B2F5B' }}>AI Questions</h3>
              <BulletList items={assessment.ai_questions} />

              <h3 style={{ color: '#0B2F5B' }}>Caliber Internal Recommendation</h3>
              <InternalRecommendation data={assessment.ai_internal_recommendation} />
            </div>
          ) : (
            <p className="muted" style={{ marginTop: 14 }}>
              Run AI Assessment to generate cost risk, production, opportunity, and internal recommendation analysis.
            </p>
          )}
        </Section>

        <Section title="Submitted Details">
          <DetailGrid assessment={assessment} />
        </Section>

        <Section title="Uploaded Photos and Videos">
          {files.length === 0 && <p className="muted">No uploaded files found.</p>}
          <div className="grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16 }}>
            {files.map(f => (
              <div key={f.id} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 14, background: '#f8fafc' }}>
                <strong style={{ color: '#0B2F5B' }}>{f.file_label || 'File'}</strong>
                <p className="muted" style={{ fontSize: 13 }}>{f.file_name}</p>
                {f.signed_url && f.file_type?.startsWith('image/') && <img src={f.signed_url} alt={f.file_label || f.file_name} style={{ width: '100%', borderRadius: 12, marginTop: 10 }} />}
                {f.signed_url && f.file_type?.startsWith('video/') && <video src={f.signed_url} controls style={{ width: '100%', borderRadius: 12, marginTop: 10 }} />}
              </div>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}

function Section({ title, children }) {
  return <section className="card" style={{ padding: 24, marginTop: 20 }}><h2 style={{ color: '#0B2F5B' }}>{title}</h2>{children}</section>;
}

function Metric({ label, value }) {
  return <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>{label}</div><div style={{ color: '#0B2F5B', fontSize: 20, fontWeight: 900 }}>{value}</div></div>;
}

function HealthScores({ data }) {
  if (!data) return <p className="muted">No health score available.</p>;
  return <div style={{ display: 'grid', gap: 10 }}>{Object.entries(data).map(([key, value]) => <Bar key={key} label={key.replaceAll('_', ' ')} value={value} />)}</div>;
}

function Bar({ label, value }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return <div><div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0B2F5B', textTransform: 'capitalize' }}><span>{label}</span><span>{pct}/100</span></div><div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, marginTop: 5 }}><div style={{ height: '100%', width: `${pct}%`, background: '#0F67B1', borderRadius: 999 }} /></div></div>;
}

function RiskList({ items }) {
  if (!items?.length) return <p className="muted">No cost risks generated.</p>;
  return <div style={{ display: 'grid', gap: 12 }}>{items.map((item, idx) => <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, background: '#f8fafc' }}><strong style={{ color: item.level === 'High' ? '#b42318' : item.level === 'Medium' ? '#b7791f' : '#047857' }}>{item.level} Risk: {item.title}</strong><p>{item.impact}</p><p className="muted"><strong>Mitigation:</strong> {item.mitigation}</p></div>)}</div>;
}

function Profitability({ data }) {
  if (!data) return <p className="muted">No profitability analysis generated.</p>;
  return <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16 }}><p><strong>Margin Outlook:</strong> {data.margin_outlook}</p><p><strong>Expected Margin:</strong> {data.expected_margin_range}</p><p><strong>Recommended Price:</strong> {data.recommended_price_per_room}</p><p><strong>Do Not Go Below:</strong> {data.do_not_go_below}</p><p>{data.reasoning}</p></div>;
}

function Production({ data }) {
  if (!data) return <p className="muted">No production analysis generated.</p>;
  return <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16 }}><p><strong>Estimated Production:</strong> {data.estimated_rooms_per_day} rooms/day</p><p><strong>Could Improve To:</strong> {data.production_can_improve_to}</p><p><strong>Limiting Factors:</strong></p><BulletList items={data.limiting_factors} /><p><strong>Conditions to Improve:</strong></p><BulletList items={data.conditions_to_improve} /></div>;
}

function OpportunityList({ items }) {
  if (!items?.length) return <p className="muted">No opportunities generated.</p>;
  return <div style={{ display: 'grid', gap: 10 }}>{items.map((item, idx) => <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}><strong style={{ color: '#0B2F5B' }}>{item.opportunity}</strong><p>{item.reason}</p><span className="badge">{item.priority} Priority</span></div>)}</div>;
}

function CostDrivers({ items }) {
  if (!items?.length) return <p className="muted">No cost drivers generated.</p>;
  return <div style={{ display: 'grid', gap: 10 }}>{items.map((item, idx) => <div key={idx}><Bar label={item.category} value={item.percent} /><small className="muted">{item.note}</small></div>)}</div>;
}

function Confidence({ data }) {
  if (!data) return <p className="muted">No confidence score generated.</p>;
  return <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16 }}><p><strong>Confidence:</strong> {data.score}/100 | {data.level}</p><p><strong>Basis:</strong></p><BulletList items={data.basis} /><p><strong>Missing Items:</strong></p><BulletList items={data.missing_items} /></div>;
}

function InternalRecommendation({ data }) {
  if (!data) return <p className="muted">No internal recommendation generated.</p>;
  return <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 14, padding: 16 }}><p><strong>Recommended Crew:</strong> {data.recommended_crew}</p><p><strong>Crew Mix:</strong></p><BulletList items={data.crew_mix} /><p><strong>Estimated Duration:</strong> {data.estimated_duration}</p><p><strong>Expected Revenue:</strong> {data.expected_revenue}</p><p><strong>Expected Gross Margin:</strong> {data.expected_gross_margin}</p><p><strong>Positioning:</strong> {data.recommended_positioning}</p><p><strong>Sales Notes:</strong></p><BulletList items={data.sales_notes} /></div>;
}

function BulletList({ items }) {
  if (!items?.length) return <p className="muted">N/A</p>;
  return <ul>{items.map((item, idx) => <li key={idx}>{item}</li>)}</ul>;
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
    ['Top Issues', (assessment.top_issues || []).join(', ')],
    ['Room Release Notes', assessment.room_release_notes],
    ['Notes', assessment.notes]
  ];

  return <div style={{ display: 'grid', gap: 10 }}>{rows.map(([label, value]) => <div key={label} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}><strong style={{ color: '#0B2F5B' }}>{label}</strong><span style={{ color: '#475569' }}>{value || 'N/A'}</span></div>)}</div>;
}
