import { isDev } from '@/packages/ui/utils/dev';
import { sign } from '@/utils/jwt';
import { isReadonly } from '@/utils/server/auth';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest) {
  if (isReadonly(req)) {
    return new NextResponse();
  }

  cookies().set({
    name: 'auth',
    value: await sign({ sub: 'admin' }),
    path: '/',
    secure: !isDev,
    sameSite: 'strict',
    maxAge: parseInt(process.env.JWT_MAX_AGE || '1800') + 300,
  } as ResponseCookie);

  return new NextResponse();
}

export const dynamic = 'force-dynamic';
