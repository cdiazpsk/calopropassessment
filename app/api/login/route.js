import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const password = body.password;

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured.' }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('caliber_admin_auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 8
  });

  return response;
}
