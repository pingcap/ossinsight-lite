import { createServerContext } from '@/app/(share)/widgets/[id]/utils';
import widgetsManifest from '@/core/widgets-manifest';
import { VisualizeType } from '@/packages/widgets/src/components/visualize/common';
import { sql } from '@/utils/mysql';
import { isReadonly } from '@/utils/server/auth';
import { GlobalFonts } from '@napi-rs/canvas';
import { defaults } from 'chart.js';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';

defaults.font.family = 'CabinSketch';

let patched = false;

// TODO: font not applied
const fontPath = path.join(__dirname, '../../../../../../../static/CabinSketch-Regular.ttf');
if (!GlobalFonts.registerFromPath(fontPath, 'CabinSketch')) {
  console.warn('font not registered from', fontPath);
}

export async function GET (req: NextRequest, { params: { id } }: any) {
  let readonly = req.headers.get('X-Readonly') === 'true';
  id = decodeURIComponent(id);

  const item = await sql.unique<{ name: string, props: { sql: string, currentDb: string, visualize: VisualizeType }, visibility: string }>`
      SELECT widget_name AS name,
             properties  AS props,
             visibility  AS visibility
      FROM library_items
      WHERE id = ${id}
        AND widget_name IN ('db/sql', 'db/sql/remote')
  `;
  if (!item) {
    notFound();
  }

  if (isReadonly(req) && item.visibility !== 'public') {
    return new NextResponse(null, {
      status: 401,
    });
  }
  const { name, props } = item;

  const widget = widgetsManifest[name];
  if (!widget) {
    notFound();
  }

  if (!widget.getData) {
    notFound();
  }

  const getData = (await widget.getData()).default;

  const data = await getData(createServerContext(id), props);

  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic';
