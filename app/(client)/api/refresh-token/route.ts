import { getSiteConfig } from '@/actions/site';
import { isDev } from '@/packages/ui/utils/dev';
import { sign } from '@/utils/jwt';
import { sql } from '@/utils/mysql';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest) {
  const auth = req.cookies.get('auth');
  if (!auth) {
    return new NextResponse();
  }
  const siteConfig = await getSiteConfig(sql);

  cookies().set({
    name: 'auth',
    value: await sign({ sub: 'admin' }, siteConfig['security.jwt.secret']),
    path: '/',
    secure: !isDev,
    sameSite: 'strict',
    maxAge: parseInt(process.env.JWT_MAX_AGE || '1800') + 300,
  } as ResponseCookie);

  return new NextResponse();
}

export const dynamic = 'force-dynamic';
