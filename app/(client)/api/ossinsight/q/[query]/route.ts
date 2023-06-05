import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest, { params }: any) {
  const { query } = params;

  const uri = new URL(`https://api.ossinsight.io/q/${query}` + req.nextUrl.search);

  const key = `ossinsight:q/${query}${req.nextUrl.search}`;

  const response = await fetch(uri.toString());
  const data = await response.json();

  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic';
