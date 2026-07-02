import Link from 'next/link';
import Header from '../../components/Header';
import { serviceSupabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAssessments() {
  try {
    const s = serviceSupabase();
    const { data, error } = await s
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) return { data: [], error: error.message };

    const seen = new Set();
    const deduped = [];

    for (const item of data || []) {
      if (!item?.id) continue;
      const key = [
        item.property_name || '',
        item.brand || '',
        item.property_city || '',
        item.property_state || ''
      ].join('|').toLowerCase();

      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(item);
    }

    return { data: deduped, error: null };
  } catch (e) {
    return { data: [], error: e.message };
  }
}

export default async function AdminPage() {
  const { data: assessments, error } = await getAssessments();

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 20px 70px' }}>
        <p className="kicker">Internal Dashboard</p>
        <h1 className="h1">Assessment Pipeline</h1>

        {error && (
          <div className="card" style={{ padding: 18, color: '#b42318', marginBottom: 18, fontWeight: 800 }}>
            Admin error: {error}
          </div>
        )}

        <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16 }}>
          {assessments.map(x => (
            <Link key={x.id} href={`/admin/${x.id}`} className="card" style={{ padding: 20 }}>
              <p style={{ margin: 0, color: '#0F67B1', fontWeight: 900, fontSize: 12 }}>
                {x.property_category || 'N/A'}
              </p>
              <h2 style={{ color: '#0B2F5B', margin: '8px 0 8px' }}>{x.property_name}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {x.brand || 'N/A'} | {x.property_city || 'N/A'}, {x.property_state || 'N/A'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 14 }}>
                <Metric label="Score" value={x.readiness_score || 'N/A'} />
                <Metric label="Prod." value={`${x.estimated_rooms_per_day || 'N/A'}/day`} />
              </div>
              <p className="muted"><strong>{x.recommended_program || 'N/A'}</strong></p>
            </Link>
          ))}

          {assessments.length === 0 && (
            <div className="card" style={{ padding: 20, color: '#64748b' }}>No assessments found.</div>
          )}
        </div>
      </main>
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 12, padding: 10 }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>{label}</div>
      <strong style={{ color: '#0B2F5B' }}>{value}</strong>
    </div>
  );
}
