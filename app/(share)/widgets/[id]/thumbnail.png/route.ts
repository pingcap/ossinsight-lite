import config from '@/.osswrc.json';
import widgetsManifest from '@/core/widgets-manifest';
import { VisualizeType } from '@/packages/widgets/src/components/visualize/common';
import { getDatabaseUri, sql, withConnection } from '@/utils/mysql';
import { createCanvas } from '@napi-rs/canvas';
import '@ossinsight-lite/roughness/chartjs';
import 'chartjs-adapter-luxon';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

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
  }, props, canvas.getContext('2d') as any, 800, 418);

  return new NextResponse(canvas.toBuffer('image/png'), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}

export const dynamic = 'force-dynamic';
