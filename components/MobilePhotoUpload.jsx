'use client';

export default function MobilePhotoUpload({ label, files = [], onChange }) {
  const count = files?.length || 0;

  return (
    <label
      style={{
        border: count ? '2px solid #0F67B1' : '1px dashed #cbd5e1',
        borderRadius: 18,
        padding: 18,
        background: count ? '#EAF4FF' : '#f8fafc',
        display: 'block',
        minHeight: 118,
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <strong style={{ color: '#0B2F5B', fontSize: 16 }}>{label}</strong>
          <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: 13, lineHeight: 1.35 }}>
            Tap to take a photo or choose existing photos/videos.
          </p>
        </div>

        <div
          style={{
            background: count ? '#0B2F5B' : 'white',
            color: count ? 'white' : '#0B2F5B',
            border: '1px solid #cbd5e1',
            borderRadius: 999,
            padding: '6px 10px',
            fontWeight: 900,
            fontSize: 12,
            whiteSpace: 'nowrap'
          }}
        >
          {count ? `✓ ${count}` : 'Add'}
        </div>
      </div>

      <input
        style={{ display: 'none' }}
        type="file"
        multiple
        accept="image/*,video/*"
        capture="environment"
        onChange={e => onChange(Array.from(e.target.files || []))}
      />

      {count > 0 && (
        <p style={{ margin: '12px 0 0', color: '#0B2F5B', fontSize: 13, fontWeight: 800 }}>
          {count} file{count === 1 ? '' : 's'} selected
        </p>
      )}
    </label>
  );
}
