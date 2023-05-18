import { NextRequest, NextResponse } from 'next/server';
import kv from '@vercel/kv';
import { Dashboard } from '@/src/types/config';

export async function GET (req: NextRequest) {
  const dashboards = await kv.hgetall<Record<string, Dashboard>>('dashboards');
  return NextResponse.json(dashboards);
}

