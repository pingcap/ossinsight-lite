import { sql } from '@/utils/mysql';
import { isReadonly } from '@/utils/server/auth';
import { LibraryItem } from '@/utils/types/config';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest, { params }: any) {
  const item = await sql.unique<LibraryItem>`
      SELECT id, widget_name AS name, properties AS props, visibility
      FROM library_items
      WHERE id = ${decodeURIComponent(params.id)}
  `;

  if (!item) {
    notFound();
  }

  if (isReadonly(req) && item.visibility !== 'public') {
    notFound();
  }

  return NextResponse.json(item);
}
