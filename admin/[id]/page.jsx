'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminIdRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const id = pathname.split('/').filter(Boolean).pop();

    if (id && id !== 'undefined') {
      router.replace(`/admin/detail?id=${id}`);
    } else {
      router.replace('/admin');
    }
  }, [pathname, router]);

  return (
    <main style={{ padding: 40 }}>
      Redirecting assessment...
    </main>
  );
}
