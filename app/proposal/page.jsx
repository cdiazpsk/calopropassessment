import Link from 'next/link';
import Header from '../../components/Header';
import { serviceSupabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAssessment(id) {
  const s = serviceSupabase();
  const { data } = await s.from('assessments').select('*').eq('id', id).single();
  return data;
}

export default async function ProposalPage({ searchParams }) {
  const sp = await searchParams;
  const a = sp?.id ? await getAssessment(sp.id) : null;

  if (!a) return <><Header /><main style={{ padding: 30 }}>Assessment not found.</main></>;

  const price = a.ai_recommended_pricing || a.recommended_pricing || 'Pricing to be confirmed';
  const program = a.ai_recommended_program || a.recommended_program || 'Property Assessment';
  const prod = a.ai_estimated_rooms_per_day || a.estimated_rooms_per_day || 'TBD';
  const addons = a.ai_recommended_addons || [];
  const profitability = a.ai_profitability_analysis;
  const risks = a.ai_cost_risks || [];
  const opportunities = a.ai_opportunity_analysis || [];

  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '36px 20px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href={`/assessment-review?id=${a.id}`} className="btn-secondary">Back to Assessment</Link>
        </div>

        <section className="card" style={{ padding: 34, background: 'white' }}>
          <p className="kicker">Caliber Proposal Draft</p>
          <h1 style={{ color: '#0B2F5B', fontSize: 40, margin: '8px 0 6px', fontWeight: 900 }}>{a.property_name}</h1>
          <p className="muted">{a.brand} | {a.property_category} | {a.property_city}, {a.property_state}</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />

          <h2 style={{ color: '#0B2F5B' }}>Executive Summary</h2>
          <p>{a.ai_summary || `Caliber Lodging has reviewed the submitted property assessment for ${a.property_name}. Based on the information provided, the recommended program is ${program}.`}</p>

          <h2 style={{ color: '#0B2F5B' }}>Recommended Program</h2>
          <p><strong>{program}</strong></p>

          <h2 style={{ color: '#0B2F5B' }}>Production Forecast</h2>
          <p>Estimated production cadence: <strong>{prod} rooms per day</strong>.</p>

          <h2 style={{ color: '#0B2F5B' }}>Budgetary Pricing</h2>
          <p>Recommended pricing range: <strong>{price}</strong></p>

          {profitability && (
            <>
              <h2 style={{ color: '#0B2F5B' }}>Internal Profitability Outlook</h2>
              <p><strong>Margin Outlook:</strong> {profitability.margin_outlook}</p>
              <p><strong>Expected Margin:</strong> {profitability.expected_margin_range}</p>
              <p><strong>Do Not Go Below:</strong> {profitability.do_not_go_below}</p>
            </>
          )}

          <h2 style={{ color: '#0B2F5B' }}>Recommended Add-Ons</h2>
          {addons.length ? <ul>{addons.map(x => <li key={x}>{x}</li>)}</ul> : <p>No AI add-ons generated yet.</p>}

          <h2 style={{ color: '#0B2F5B' }}>Key Cost Risks</h2>
          {risks.length ? <ul>{risks.map((x, i) => <li key={i}><strong>{x.level}:</strong> {x.title} - {x.impact}</li>)}</ul> : <p>No cost risks generated yet.</p>}

          <h2 style={{ color: '#0B2F5B' }}>Potential Opportunities</h2>
          {opportunities.length ? <ul>{opportunities.map((x, i) => <li key={i}><strong>{x.opportunity}:</strong> {x.reason}</li>)}</ul> : <p>No opportunities generated yet.</p>}
        </section>
      </main>
    </>
  );
}
