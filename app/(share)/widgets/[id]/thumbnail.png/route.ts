import config from '@/.osswrc.json';
import widgetsManifest from '@/core/widgets-manifest';
import { VisualizeType } from '@/packages/widgets/src/components/visualize/common';
import { getDatabaseUri, sql, withConnection } from '@/utils/mysql';
import { createCanvas, GlobalFonts, Path2D } from '@napi-rs/canvas';
import { defaults } from 'chart.js';
import { patchContext2D } from 'chartjs-plugin-roughness';
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

  const item = await sql.unique<{ name: string, props: { sql: string, currentDb: string, visualize: VisualizeType } }>`
      SELECT widget_name AS name,
             properties  AS props
      FROM library_items
      WHERE id = ${id}
  `;
  if (!item) {
    notFound();
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
  await createPngThumbnail({
    async runSql (dbName: string, sql: string) {
      const db = config.db.find(db => db.name = dbName);
      if (!db) {
        throw new Error(`Unknown datasource ${dbName}`);
      }
      const uri = getDatabaseUri(process.env[db.env] || db.database);

      const [rows] = await withConnection(uri, conn => conn.execute(sql));
      return rows as any[];
    },
  }, props, ctx as any, 800, 418);

  return new NextResponse(canvas.toBuffer('image/png'), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}

export const dynamic = 'force-dynamic';
