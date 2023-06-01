import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest, { params: { owner, repo, branch, path } }: any) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/collections/${path.join('/')}`;
  const isJs = path[path.length - 1].endsWith('.js');
  // https://raw.githubusercontent.com/634750802/ossinsight-lite/feat-remote-sql-widget/collections/contribution-monthly/visualization.js
  const res = await fetch(url);
  if (res.ok) {
    return new NextResponse(res.body, {
      status: res.status,
      headers: {
        ...res.headers,
        ...isJs ? {
          'Content-Type': 'text/javascript',
        } : {},
      },
    });
  } else {
    console.log(url)
    return new NextResponse(res.body, {
      status: res.status,
    });
  }
}
