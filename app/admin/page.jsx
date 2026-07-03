import Link from 'next/link';
import Header from '../../components/Header';
import { serviceSupabase } from '../../lib/supabase';
import PipelineCardActions from '../../components/PipelineCardActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAssessments() {
  const s = serviceSupabase();

  const { data, error } = await s
    .from('assessments')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };

  const map = new Map();

  for (const row of data || []) {
    if (!row?.id) continue;
    const key = (row.property_name || '').trim().toLowerCase();
    if (!map.has(key)) map.set(key, row);
  }

  return { data: Array.from(map.values()), error: null };
}

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default async function AdminPage() {
  const { data: assessments, error } = await getAssessments();

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 20px 80px' }}>
        <p className="kicker">Internal Dashboard</p>
        <h1 className="h1">Assessment Pipeline</h1>

        {error && <div className="card" style={{ padding: 20, color: '#b42318', marginBottom: 20 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))', gap: 18 }}>
          {assessments.map(a => (
            <div key={a.id} className="card" style={{ padding: 22 }}>
              <Link href={`/assessment-review?id=${a.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ color: '#0F67B1', fontWeight: 800, fontSize: 12, textTransform: 'uppercase' }}>
                  {a.property_category || 'Property'}
                </div>

                <h2 style={{ color: '#0B2F5B', margin: '8px 0' }}>{a.property_name}</h2>

                <p style={{ color: '#64748b', marginBottom: 8 }}>
                  {a.brand || 'N/A'} • {a.property_city || 'N/A'}, {a.property_state || 'N/A'}
                </p>

                <p style={{ color: '#64748b', fontSize: 13, marginTop: 0 }}>
                  Created: {formatDate(a.created_at)}<br />
                  By: {a.contact_name || a.contact_email || 'N/A'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Metric label="Score" value={a.ai_condition_score || a.readiness_score || '--'} />
                  <Metric label="Production" value={`${a.ai_estimated_rooms_per_day || a.estimated_rooms_per_day || '--'}/day`} />
                </div>

                <div style={{ marginTop: 16, color: '#0B2F5B', fontWeight: 700 }}>
                  {a.ai_recommended_program || a.recommended_program || 'Pending'}
                </div>
              </Link>

              <PipelineCardActions assessmentId={a.id} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 24, color: '#0B2F5B', fontWeight: 900 }}>{value}</div>
    </div>
  );
}
