import { NextRequest, NextResponse } from 'next/server';
import { verify } from './utils/jwt';

export async function middleware (req: NextRequest) {
  let allowAnonymous = anonymousAuth(req);
  if (allowAnonymous || needAuth(req)) {
    let authenticated = false;
    let error: string | undefined = undefined;
    try {
      const auth = req.cookies.get('auth')?.value;
      if (auth) {
        const res = await verify(auth);
        if (res.exp) {
          if (res.exp * 1000 < Date.now()) {
            throw new Error('JWT Token expired.');
          }
        }
        authenticated = true;
      }
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
      return NextResponse.redirect(req.nextUrl.origin + `/login?redirect_uri=${encodeURIComponent(redirectUri)}`, {
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
  if (req.nextUrl.pathname === '/' || /^\/dashboards\/[^/]*\/?$/.test(req.nextUrl.pathname)) {
    return true;
  }
  if (/^\/widgets\/[^/]+(?:\/(?:thumbnail\.png)?)?$/.test(req.nextUrl.pathname)) {
    return true;
  }
  if (req.nextUrl.pathname === 'layout.json') {
    return true;
  }
  if (/^\/api\/(refresh-token|auth)$/.test(req.nextUrl.pathname)) {
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
