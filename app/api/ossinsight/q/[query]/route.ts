import { NextRequest, NextResponse } from 'next/server';
import kv from '@vercel/kv';

export async function GET (req: NextRequest, { params }: any) {
  const { query } = params;

  const uri = new URL(`https://api.ossinsight.io/q/${query}` + req.nextUrl.search);

  const key = `ossinsight:q/${query}${req.nextUrl.search}`;

  try {
    const cached = await kv.get(key);
    if (cached) {
      return NextResponse.json(cached);
    }
  } catch {
  }

  const response = await fetch(uri.toString());
  const data = await response.json();
  try {
    await kv.setex(key, 60000, data);
  } catch {
  }

  return NextResponse.json(data);
}
