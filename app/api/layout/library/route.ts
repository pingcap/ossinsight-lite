import { NextRequest, NextResponse } from 'next/server';
import kv from '@/app/api/kv';
import { LibraryItem } from '@/src/types/config';

export async function GET (req: NextRequest) {
  const items = await kv.hgetall<Record<string, LibraryItem>>('library');
  return NextResponse.json(items);
}

