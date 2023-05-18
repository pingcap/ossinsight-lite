import { NextRequest, NextResponse } from 'next/server';
import { saveLayout } from '@/app/api/layout/operations';

export async function POST (req: NextRequest) {
  const config = await req.json();
  const res = await saveLayout(config);
  return NextResponse.json(res);
}
