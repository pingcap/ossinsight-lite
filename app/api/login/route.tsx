import { authenticate } from '@/src/auth';
import { NextRequest, NextResponse } from 'next/server';

async function login (form: FormData) {
  const username = form.get('username') || 'admin';
  const password = form.get('password');

  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error('Bad credential');
  }

  if (!await authenticate(username, password)) {
    throw new Error('Bad credential');
  }

  return `${Buffer.from(username).toString('base64url')}:${Buffer.from(password).toString('base64url')}`;
}

export async function POST (req: NextRequest) {
  const ru = req.nextUrl.searchParams.get('redirect_uri') || '/';

  try {
    const formData = await req.formData();
    const authString = await login(formData);

    return NextResponse.redirect(`${req.nextUrl.origin}${ru}`, {
      status: 302,
      headers: {
        'Set-Cookie': `auth=${authString}; HttpOnly; Path=/`,
      },
    });
  } catch (e: any) {
    return NextResponse.redirect(`${req.nextUrl.origin}/login?redirect_uri=${encodeURIComponent(ru)}&error=${encodeURIComponent(String(e?.message || e))}`, {
      status: 302,
    });
  }
}