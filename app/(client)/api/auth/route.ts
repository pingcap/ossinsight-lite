import { getSiteConfig } from '@/actions/site';
import { verify } from '@/utils/jwt';
import { sql } from '@/utils/mysql';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest) {

  const auth = req.cookies.get('auth');
  if (!auth) {
    return {
      authenticated: false,
      playground: false,
    };
  }
  const siteConfig = await getSiteConfig(sql);

  try {
    await verify(auth.value, siteConfig['security.jwt.secret']);
    return NextResponse.json({
      authenticated: true,
      playground: siteConfig['security.enable-public-data-access'],
    });
  } catch (e: any) {
    return NextResponse.json(e.message, {
      status: 401,
    });
  }
}
