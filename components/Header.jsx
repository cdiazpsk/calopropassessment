import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/caliber-logo.jpg"
            alt="Caliber Lodging"
            width={260}
            height={55}
            priority
            style={{ height: 'auto', maxWidth: 260 }}
          />
        </Link>
        <nav style={{ display: 'flex', gap: 18, fontSize: 14, fontWeight: 700, color: '#475569' }}>
          <Link href="/admin/login">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
