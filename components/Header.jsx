import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            textDecoration: 'none'
          }}
        >
          <img
            src="/caliber-logo.jpg"
            alt="Caliber Lodging"
            style={{
              height: 44,
              width: 'auto',
              display: 'block'
            }}
          />

          <div
            style={{
              color: '#64748b',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.2,
              whiteSpace: 'nowrap'
            }}
          >
            One Partner. Every Location.
          </div>
        </Link>

        <nav
          style={{
            display: 'flex',
            gap: 18,
            fontSize: 14,
            fontWeight: 800,
            color: '#475569',
            alignItems: 'center'
          }}
        >
          <Link href="/admin/login">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
