'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import MobilePhotoUpload from '../../components/MobilePhotoUpload';
import { browserSupabase } from '../../lib/supabase';
import { scoreAssessment } from '../../lib/scoring';
import { brands } from '../../lib/brands';
import { SERVICE_CONFIG, getServiceConfig, scoreDescriptions } from '../../lib/serviceConfig';

const initial = {
  assessment_reason: 'Preventative Maintenance',
  service_categories: ['Guestroom PM'],
  property_name: '',
  management_company: '',
  owner_company: '',
  brand: '',
  property_city: '',
  property_state: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  total_rooms: '',
  last_renovated_year: '',
  rooms_available_per_day: '',
  floor_release_available: true,
  materials_owner_supplied: true,
  comp_rooms_available: true,
  meals_provided: true,
  room_release_notes: '',
  paint_score: 3,
  caulk_score: 3,
  furniture_score: 3,
  hvac_score: 3,
  plumbing_score: 3,
  doors_score: 3,
  logistics_score: 3,
  room_release_score: 3,
  main_area_paint_score: 3,
  public_caulk_score: 3,
  drywall_score: 3,
  baseboards_score: 3,
  exterior_condition_score: 3,
  upholstery_score: 3,
  vinyl_wallpaper_score: 3,
  hvac_equipment_score: 3,
  ice_machine_score: 3,
  walkin_cooler_score: 3,
  reachin_equipment_score: 3,
  kitchen_equipment_score: 3,
  laundry_equipment_score: 3,
  mechanical_access_score: 3,
  flooring_score: 3,
  fixtures_score: 3,
  top_issues: [],
  notes: ''
};

const reasons = ['Preventative Maintenance', 'Budget Pricing', 'Capital Planning', 'Due Diligence', 'New Acquisition', 'PIP Planning', 'Mechanical Assessment', 'General Maintenance', 'Other'];
const services = Object.keys(SERVICE_CONFIG);
const issues = ['Heavy caulking needed', 'Widespread paint touch-ups', 'Corner-to-corner paint needed', 'Furniture touch-ups', 'PTAC/VTAC cleaning', 'Drain issues', 'Entry door painting', 'Grout refresh', 'Room release constraints', 'Mechanical concerns', 'Public area wear', 'Capital project needed'];
const steps = ['Reason', 'Property', 'Operations', 'Ratings', 'Issues', 'Photos', 'Notes'];

export default function AssessmentPage() {
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState('');
  const [step, setStep] = useState(0);
  const [draftStatus, setDraftStatus] = useState('');

  const serviceConfig = getServiceConfig(form.service_categories);
  const scored = useMemo(() => scoreAssessment(form), [form]);

useEffect(() => {
  const saved = localStorage.getItem('caliber_assessment_draft_v2');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setForm({ ...initial, ...parsed.form });
      setStep(Math.min(parsed.step || 0, 5));
    } catch {}
  }
}, []);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem('caliber_assessment_draft_v2', JSON.stringify({ form, step }));
      setDraftStatus('Draft saved');
      setTimeout(() => setDraftStatus(''), 1800);
    }, 600);

    return () => clearTimeout(t);
  }, [form, step]);

  function update(k, v) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function selectService(service) {
    setForm(p => ({ ...p, service_categories: [service] }));
    setFiles({});
  }

  function toggleIssue(v) {
    setForm(p => ({
      ...p,
      top_issues: p.top_issues.includes(v)
        ? p.top_issues.filter(x => x !== v)
        : [...p.top_issues, v]
    }));
  }

  function nextStep() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(steps.length - 1, s + 1));
  }

  function prevStep() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(0, s - 1));
  }

  function clearDraft() {
    localStorage.removeItem('caliber_assessment_draft_v2');
    setForm(initial);
    setFiles({});
    setStep(0);
    setDraftStatus('Draft cleared');
  }

  async function submit(e) {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const supabase = browserSupabase();
      const id = crypto.randomUUID();

      const payload = {
        id,
        ...form,
        property_category: scored.property_category,
        total_rooms: Number(form.total_rooms),
        last_renovated_year: form.last_renovated_year ? Number(form.last_renovated_year) : null,
        rooms_available_per_day: form.rooms_available_per_day ? Number(form.rooms_available_per_day) : null,
        ...scored
      };

      const { error } = await supabase.from('assessments').insert(payload);
      if (error) throw error;

      for (const [label, list] of Object.entries(files)) {
        for (const file of list) {
          const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = `${id}/${label.replace(/[^a-zA-Z0-9._-]/g, '_')}_${Date.now()}_${safe}`;

          const up = await supabase.storage.from('assessment-media').upload(path, file);
          if (up.error) throw up.error;

          const row = await supabase.from('assessment_files').insert({
            assessment_id: id,
            file_label: label,
            file_name: file.name,
            file_path: path,
            file_type: file.type,
            file_size: file.size
          });

          if (row.error) throw row.error;
        }
      }

      localStorage.removeItem('caliber_assessment_draft_v2');
      window.location.href = '/thank-you';
    } catch (err) {
      setStatus(err.message || 'Submission failed.');
    }
  }

  const photoCount = serviceConfig.photos.filter(label => (files[label] || []).length > 0).length;
  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '28px 20px 110px' }}>
        <p className="kicker">Caliber Property Assessment</p>
        <h1 className="h1">Property Assessment</h1>

        <div style={{ margin: '18px 0 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0B2F5B', fontWeight: 900 }}>
            <span>Step {step + 1} of {steps.length}: {steps[step]}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 10, background: '#e2e8f0', borderRadius: 999, marginTop: 8 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#0F67B1', borderRadius: 999 }} />
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', gap: 12, color: '#64748b', fontSize: 13, fontWeight: 700 }}>
            <span>{draftStatus || 'Autosaves while you work'}</span>
            <button type="button" onClick={clearDraft} style={{ border: 0, background: 'transparent', color: '#0F67B1', fontWeight: 900, cursor: 'pointer' }}>
              Clear Draft
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {step === 0 && (
            <Card title="1. Reason and Service Type">
              <Select label="Primary Reason" value={form.assessment_reason} onChange={v => update('assessment_reason', v)} options={reasons} />
              <p className="label" style={{ marginTop: 16 }}>Primary Service Type</p>
              <Chips items={services} selected={form.service_categories} onClick={selectService} />
            </Card>
          )}

          {step === 1 && (
            <Card title="2. Property Information">
              <Grid>
                <Field label="Property Name" required value={form.property_name} onChange={v => update('property_name', v)} />
                <Field label="Management Company" value={form.management_company} onChange={v => update('management_company', v)} />
                <Field label="Ownership Group" value={form.owner_company} onChange={v => update('owner_company', v)} />
                <Select label="Brand" value={form.brand} onChange={v => update('brand', v)} options={['', ...brands]} />
                <Field label="City" value={form.property_city} onChange={v => update('property_city', v)} />
                <Field label="State" value={form.property_state} onChange={v => update('property_state', v)} />
                <Field label="Total Rooms" type="number" required value={form.total_rooms} onChange={v => update('total_rooms', v)} />
                <Field label="Last Renovated Year" type="number" value={form.last_renovated_year} onChange={v => update('last_renovated_year', v)} />
              </Grid>
              {form.brand && <p><span className="badge">Auto Category: {scored.property_category}</span></p>}
            </Card>
          )}

          {step === 2 && (
            <Card title="3. Contact and Operations">
              <Grid>
                <Field label="Contact Name" required value={form.contact_name} onChange={v => update('contact_name', v)} />
                <Field label="Contact Email" type="email" required value={form.contact_email} onChange={v => update('contact_email', v)} />
                <Field label="Contact Phone" value={form.contact_phone} onChange={v => update('contact_phone', v)} />
                <Field label="Rooms Available Per Day" type="number" value={form.rooms_available_per_day} onChange={v => update('rooms_available_per_day', v)} />
              </Grid>
              <div className="grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12, marginTop: 16 }}>
                <Toggle label="Floor Release Available" value={form.floor_release_available} onChange={v => update('floor_release_available', v)} />
                <Toggle label="Owner Supplies Materials" value={form.materials_owner_supplied} onChange={v => update('materials_owner_supplied', v)} />
                <Toggle label="Comp Rooms Available" value={form.comp_rooms_available} onChange={v => update('comp_rooms_available', v)} />
                <Toggle label="Meals Provided" value={form.meals_provided} onChange={v => update('meals_provided', v)} />
              </div>
              <TextArea label="Room Release Notes" value={form.room_release_notes} onChange={v => update('room_release_notes', v)} />
            </Card>
          )}

          {step === 3 && (
            <Card title={`4. ${form.service_categories[0]} Condition Ratings`}>
              <p className="muted">1 = very poor, 3 = average/fair, 5 = excellent.</p>
              <Grid>
                {serviceConfig.scores.map(([key, label]) => (
                  <Score key={key} label={label} value={form[key] || 3} onChange={v => update(key, Number(v))} />
                ))}
              </Grid>
            </Card>
          )}

          {step === 4 && (
            <Card title="5. Top Issues">
              <Chips items={issues} selected={form.top_issues} onClick={toggleIssue} />
            </Card>
          )}

          {step === 5 && (
            <Card title={`6. ${form.service_categories[0]} Photos and Videos`}>
              <p className="muted">Tap each card to take photos or choose existing files. Uploaded items will show a checkmark.</p>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, marginBottom: 16 }}>
                <strong style={{ color: '#0B2F5B' }}>Photo Checklist</strong>
                <p style={{ margin: '6px 0 0', color: '#64748b' }}>{photoCount} of {serviceConfig.photos.length} sections have files selected.</p>
              </div>
              <Grid>
                {serviceConfig.photos.map(label => (
                  <MobilePhotoUpload
                    key={label}
                    label={label}
                    files={files[label] || []}
                    onChange={selected => setFiles(p => ({ ...p, [label]: selected }))}
                  />
                ))}
              </Grid>
            </Card>
          )}

          {step === 6 && (
            <Card title="7. Notes">
              <TextArea label="Notes" value={form.notes} onChange={v => update('notes', v)} />
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16, marginTop: 16 }}>
                <strong style={{ color: '#0B2F5B' }}>Ready to submit?</strong>
                <p className="muted" style={{ marginBottom: 0 }}>Caliber will review the assessment, submitted notes, and uploaded media.</p>
              </div>
            </Card>
          )}

          {status && <div className="card" style={{ padding: 18, color: '#b42318', fontWeight: 800, marginTop: 16 }}>{status}</div>}

          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'white',
              borderTop: '1px solid #e2e8f0',
              padding: '12px 16px',
              zIndex: 50
            }}
          >
            <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <button className="btn-secondary" type="button" onClick={prevStep} disabled={step === 0} style={{ opacity: step === 0 ? 0.5 : 1 }}>
                Back
              </button>

              {step < steps.length - 1 ? (  
                <button className="btn-primary" type="button" onClick={(e) => e.preventDefault(); 
                  nextStep();>
                  Continue
                    }}
                    >
                </button>
              ) : (
                  <button className="btn-primary"
                    type="button"
                    onClick={(e) => {e.preventDefault();
                                     submit(e);
                                    }}
                    >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

function Card({ title, children }) {
  return <section className="card" style={{ padding: 24 }}>{title && <h2 style={{ color: '#0B2F5B', margin: '0 0 18px', fontWeight: 900 }}>{title}</h2>}{children}</section>;
}

function Grid({ children }) {
  return <div className="grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16 }}>{children}</div>;
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return <label><span className="label">{label}{required ? ' *' : ''}</span><input className="input" type={type} required={required} value={value} onChange={e => onChange(e.target.value)} /></label>;
}

function Select({ label, value, onChange, options }) {
  return <label><span className="label">{label}</span><select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o} value={o}>{o || 'Select'}</option>)}</select></label>;
}

function TextArea({ label, value, onChange }) {
  return <label style={{ display: 'block', marginTop: 16 }}><span className="label">{label}</span><textarea style={{ minHeight: 100 }} value={value} onChange={e => onChange(e.target.value)} /></label>;
}

function Chips({ items, selected, onClick }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{items.map(item => <button key={item} type="button" onClick={() => onClick(item)} style={{ borderRadius: 999, border: '1px solid #cbd5e1', padding: '9px 12px', fontWeight: 700, background: selected.includes(item) ? '#0B2F5B' : 'white', color: selected.includes(item) ? 'white' : '#334155' }}>{item}</button>)}</div>;
}

function Toggle({ label, value, onChange }) {
  return <button type="button" onClick={() => onChange(!value)} style={{ padding: 14, borderRadius: 12, border: '1px solid #cbd5e1', background: value ? '#EAF4FF' : 'white', color: '#0B2F5B', fontWeight: 800, textAlign: 'left' }}>{value ? 'Yes' : 'No'}<br /><span style={{ fontSize: 12, color: '#64748b' }}>{label}</span><br /><small>Click to change</small></button>;
}

function Score({ label, value, onChange }) {
  return <label><span className="label">{label}: {value}</span><input type="range" min="1" max="5" value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%' }} /><small style={{ display: 'block', color: '#64748b', lineHeight: 1.4, marginTop: 6 }}>{scoreDescriptions[value]}</small></label>;
}
