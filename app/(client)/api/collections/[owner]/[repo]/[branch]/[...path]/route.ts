import {readFileSync} from "fs";
import { NextRequest, NextResponse } from 'next/server';
import path from "node:path";

export async function GET (req: NextRequest, { params: { owner, repo, branch, path: subPath } }: any) {
  const isJs = subPath[subPath.length - 1].endsWith('.js');
  const isDev = process.env.NODE_ENV === 'development';

  // Check if the repo is trusted.
  if ((owner !== 'pingcap' || repo !== 'ossinsight-lite') && !isDev) {
    return NextResponse.json({ 'message': `${owner}/${repo} is not trusted.` }, { status: 403 });
  }

  // Read config file from remote or local.
  let status = 500, headers: any = {}, body: BodyInit | null = null;
  try {
    if (!isDev) {
      const res = await readFromRemote(owner, repo, branch, subPath.join('/'));
      status = res.status;
      body = res.body;
    } else {
      status = 200;
      body = readFromLocal(subPath.join('/'));
    }
    return new NextResponse(body, {
      status: status,
      headers: {
        ...headers,
        ...isJs ? {
          'Content-Type': 'text/javascript',
        } : {},
      }
    });
  } catch (err) {
    return new NextResponse(null, {
      status,
    });
  }
}

function readFromLocal(subPath: string) {
  const filePath = path.join(process.cwd(), 'collections', subPath);
  return readFileSync(filePath, 'utf-8');
}

async function readFromRemote(owner: string, repo: string, branch: string, subPath: string) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/collections/${subPath}`;
  return fetch(url);
}

export const dynamic = 'force-dynamic';
