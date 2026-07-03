'use client';
import { useState } from 'react';
export default function PipelineCardActions({ assessmentId }) {
  const [status, setStatus] = useState('');
  async function archiveAssessment(e) {
    e.preventDefault(); e.stopPropagation(); setStatus('Archiving...');
    const res = await fetch(`/api/archive-assessment?id=${assessmentId}`, { method: 'POST' });
    if (res.ok) window.location.reload();
    else setStatus((await res.json().catch(()=>({}))).error || 'Archive failed.');
  }
  async function deleteAssessment(e) {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm('Delete this assessment permanently? This cannot be undone.')) return;
    setStatus('Deleting...');
    const res = await fetch(`/api/delete-assessment?id=${assessmentId}`, { method: 'DELETE' });
    if (res.ok) window.location.reload();
    else setStatus((await res.json().catch(()=>({}))).error || 'Delete failed.');
  }
  return <div style={{marginTop:16,display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
    <button type="button" onClick={archiveAssessment} style={{border:'1px solid #cbd5e1',background:'white',color:'#0B2F5B',borderRadius:10,padding:'8px 12px',fontWeight:800,cursor:'pointer'}}>Archive</button>
    <button type="button" onClick={deleteAssessment} style={{border:'1px solid #fecaca',background:'#fff1f2',color:'#b42318',borderRadius:10,padding:'8px 12px',fontWeight:800,cursor:'pointer'}}>Delete</button>
    {status && <span style={{color:'#b42318',fontSize:12,fontWeight:800}}>{status}</span>}
  </div>;
}
