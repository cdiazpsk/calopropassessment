import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import { serviceSupabase } from '../../lib/supabase';

async function getAssessments() {
  try {
    const s = serviceSupabase();
    const { data, error } = await s
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 24 }}>
          <div>
            <Image
              src="/caliber-logo.jpg"
              alt="Caliber Lodging"
              width={300}
              height={65}
              priority
              style={{ height: 'auto', maxWidth: 300, marginBottom: 18 }}
            />
            <p style={{ color: '#0F67B1', fontWeight: 900, letterSpacing: 1, margin: 0 }}>INTERNAL DASHBOARD</p>
            <h1 style={{ color: '#0B2F5B', fontSize: 42, fontWeight: 900, margin: '8px 0 0' }}>Assessment Pipeline</h1>
          </div>
        </div>

        {error && (
          <div className="card" style={{ padding: 18, color: '#b42318', marginBottom: 18, fontWeight: 800 }}>
            Admin error: {error}
          </div>
        )}

        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead style={{ background: '#f8fafc', color: '#64748b' }}>
              <tr>
                {['Property', 'Category', 'Reason', 'Services', 'Score', 'Program', 'Production', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: 14 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.map(x => (
                <tr key={x.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: 14, fontWeight: 900, color: '#0B2F5B' }}>
                    <Link href={`/admin/${x.id}`}>{x.property_name}</Link>
                    <div style={{ color: '#64748b', fontSize: 12, fontWeight: 400 }}>{x.brand} | {x.property_city}, {x.property_state}</div>
                  </td>
                  <td style={{ padding: 14 }}>{x.property_category || 'N/A'}</td>
                  <td style={{ padding: 14 }}>{x.assessment_reason || 'N/A'}</td>
                  <td style={{ padding: 14 }}>{(x.service_categories || []).join(', ') || 'N/A'}</td>
                  <td style={{ padding: 14 }}>{x.readiness_score || 'N/A'}</td>
                  <td style={{ padding: 14 }}>{x.recommended_program || 'N/A'}</td>
                  <td style={{ padding: 14 }}>{x.estimated_rooms_per_day || 'N/A'}/day</td>
                  <td style={{ padding: 14 }}>{x.status || 'submitted'}</td>
                </tr>
              ))}

              {assessments.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: 20, color: '#64748b' }}>No assessments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
