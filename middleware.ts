import { NextRequest, NextResponse } from 'next/server';
import { isDev } from './packages/ui/utils/dev';

export async function middleware (req: NextRequest) {
  if (req.nextUrl.pathname === '/api/auth' || req.nextUrl.pathname === '/api/refresh-token') {
    return NextResponse.next();
  }
  let allowAnonymous = anonymousAuth(req);
  if (allowAnonymous || needAuth(req)) {
    let authenticated = false;
    let error: string | undefined = undefined;
    try {
      const res = await fetch(`${isDev ? 'http' : 'https'}://${isDev ? 'localhost:3000' : process.env.VERCEL_URL}/api/auth`, {
        headers: {
          Cookie: req.cookies.toString()
        }
      });

      const { authenticated: authenticatedResp } = await res.json();
      authenticated = authenticatedResp || false;
    } catch (e) {
      error = String(e?.message ?? e);
    }

    if (!authenticated) {
      if (allowAnonymous) {
        return NextResponse.next({
          headers: {
            'X-Readonly': 'true',
          },
        });
      }

      let redirectUri = req.url.replace(/^https?:\/\/[^/]+/, '');
      return NextResponse.redirect(req.nextUrl.origin + `/login?redirect_uri=${encodeURIComponent(redirectUri ?? '/')}`, {
        headers: {
          'X-Auth-Error': error,
        },
      });
    }
  }
  return NextResponse.next();
}

function anonymousAuth (req: NextRequest) {
  if (/^\/api\/db\//.test(req.nextUrl.pathname)) {
    return true;
  }
  if (/^\/api\/library\/[^\/]$/.test(req.nextUrl.pathname)) {
    return true;
  }
  if (req.nextUrl.pathname === '/' || /^\/dashboards\/[^/]*\/?$/.test(req.nextUrl.pathname)) {
    return true;
  }
  if (/^\/widgets\/[^/]+(?:\/(?:thumbnail\.png)?)?$/.test(req.nextUrl.pathname)) {
    return true;
  }
  if (req.nextUrl.pathname === 'template.json') {
    return true;
  }
  return false;
}

function needAuth (req: NextRequest) {
  if (/\.(js|css|map|ico)$/.test(req.nextUrl.pathname)) {
    return false;
  }

  if (/^\/api\/layout$/.test(req.nextUrl.pathname)) {
    return true;
  }

  if (req.nextUrl.pathname.startsWith('/admin/')) {
    return true;
  }

  if (/\/widgets\/create\//.test(req.nextUrl.pathname)) {
    return true;
  }

  if (/\/widgets\/.+\/(edit|style)/.test(req.nextUrl.pathname)) {
    return true;
  }
  return false;
}
