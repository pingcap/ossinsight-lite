import { getSiteConfig } from '@/actions/site';
import { verify } from '@/utils/jwt';
import { sql } from '@/utils/mysql';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest) {
  const siteConfig = await getSiteConfig(sql);
  const playground = siteConfig['security.enable-public-data-access'];

  const auth = req.cookies.get('auth');
  if (!auth) {
    return NextResponse.json({
      authenticated: false,
      playground,
    });
  }

  try {
    await verify(auth.value, siteConfig['security.jwt.secret']);
    return NextResponse.json({
      authenticated: true,
      playground: true,
    });
  } catch (e: any) {
    return NextResponse.json({
      authenticated: false,
      playground,
    });
  }
}

export const dynamic = 'force-dynamic';
