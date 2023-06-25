import config from '@/.osswrc.json';
import { createServerContext } from '@/app/(share)/widgets/[id]/utils';
import widgetsManifest from '@/core/widgets-manifest';
import { VisualizeType } from '@/packages/widgets/src/components/visualize/common';
import { getDatabaseUri, sql, withConnection } from '@/utils/mysql';
import { isReadonly } from '@/utils/server/auth';
import { createCanvas, GlobalFonts, Path2D } from '@napi-rs/canvas';
import { defaults } from 'chart.js';
import { patchContext2D } from 'chartjs-plugin-roughness';
import { RowDataPacket } from 'mysql2/promise';
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
  `;
  if (!item) {
    notFound();
  }

  if (isReadonly(req) && item.visibility !== 'public') {
    // todo unauthorized image
    return new NextResponse(null, {
      status: 401,
    });
  }
  const { name, props } = item;

  const widget = widgetsManifest[name];
  if (!widget) {
    notFound();
  }

  if (!widget.createPngThumbnail) {
    notFound();
  }

  const createPngThumbnail = (await widget.createPngThumbnail()).default;

  const canvas = createCanvas(800, 418);
  const ctx = canvas.getContext('2d');
  if (!patched) {
    // @ts-ignore
    patchContext2D(ctx.__proto__.constructor, Path2D);
    patched = true;
  }
  await createPngThumbnail(createServerContext(id), props, ctx as any, 800, 418);

  return new NextResponse(canvas.toBuffer('image/png'), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}

export const dynamic = 'force-dynamic';
