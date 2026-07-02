'use client';

import { useState } from 'react';

export default function DeleteAssessmentButton({ assessmentId }) {
  const [status, setStatus] = useState('');

  async function deleteAssessment() {
    const confirmed = window.confirm('Delete this assessment permanently? This cannot be undone.');

    if (!confirmed) return;

    setStatus('Deleting...');

    try {
      const res = await fetch(`/api/delete-assessment?id=${assessmentId}`, {
        method: 'DELETE'
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus(json.error || 'Delete failed.');
        return;
      }

      window.location.href = '/admin';
    } catch (err) {
      setStatus(err.message || 'Delete failed.');
    }
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <button
        type="button"
        onClick={deleteAssessment}
        style={{
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          padding: '12px 18px',
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        Delete Assessment
      </button>

      {status && (
        <span style={{ color: '#b42318', fontWeight: 800 }}>
          {status}
        </span>
      )}
    </div>
  );
}
