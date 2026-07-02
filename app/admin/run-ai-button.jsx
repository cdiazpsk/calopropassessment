'use client';

import { useState } from 'react';

export default function RunAiButton({ assessmentId }) {
  const [status, setStatus] = useState('');

  async function runAi() {
    setStatus('Running AI assessment...');

    try {
      const res = await fetch(`/api/ai-assessment/${assessmentId}`, {
        method: 'POST'
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus(json.error || 'AI assessment failed.');
        return;
      }

      setStatus('AI assessment completed. Refreshing...');
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setStatus(err.message || 'AI request failed.');
    }
  }

  return (
    <div>
      <button className="btn-primary" onClick={runAi}>
        Run AI Assessment
      </button>

      {status && (
        <p style={{ fontWeight: 700, color: status.includes('failed') ? '#b42318' : '#0B2F5B' }}>
          {status}
        </p>
      )}
    </div>
  );
}
