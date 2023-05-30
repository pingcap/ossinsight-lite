import config from '@/.osswrc.json';
import { getCartesianScaleOption } from '@/packages/widgets/src/components/visualize/chartjs/getCartesianScaleOption';
import { barDataset } from '@/packages/widgets/src/components/visualize/chartjs/getXYData';
import { legendsPlugin } from '@/packages/widgets/src/components/visualize/chartjs/legendsPlugin';
import { titlePlugin } from '@/packages/widgets/src/components/visualize/chartjs/titlePlugin';
import { VisualizeType } from '@/packages/widgets/src/components/visualize/common';
import { getDatabaseUri, sql, withConnection } from '@/utils/mysql';
import '@ossinsight-lite/roughness/chartjs';
import { Canvas } from 'canvas';
import { Chart as ChartJs, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

ChartJs.register(
  ...registerables,
);

export async function GET (req: NextRequest, { params: { id } }: any) {
  id = decodeURIComponent(id);
  console.log(id);
  const item = await sql.unique<{ props: { sql: string, currentDb: string, visualize: VisualizeType } }>`
      SELECT properties AS props
      FROM library_items
      WHERE id = ${id}
        AND widget_name = 'db/sql'
  `;

  if (!item) {
    notFound();
  }
  const { props } = item;

  if (props.visualize.type !== 'chart:bar') {
    return NextResponse.json({
      message: `${props.visualize.type} not support yet`,
    }, { status: 400 });
  }

  const db = config.db.find(db => db.name === props.currentDb);

  if (!db) {
    return NextResponse.json({
      message: 'Bad currentDb',
    }, { status: 400 });
  }

  const [data] = await withConnection(getDatabaseUri(process.env[db.env] ?? db.database), async (conn) => {
    return conn.query<any[]>(props.sql);
  });

  const { x, y, title } = props.visualize;

  const canvas = new Canvas(800, 418);

  const chart = new ChartJs(canvas.getContext('2d') as any, {
    data: { datasets: [{ type: 'bar', ...barDataset(data, x, y) }] },
    options: {
      animation: false,
      maintainAspectRatio: false,
      indexAxis: (['x', 'y'] as const)[[x, y].findIndex(axis => axis.type !== 'value') ?? 0] ?? 'x',
      scales: {
        x: getCartesianScaleOption(data, x, 'x'),
        y: getCartesianScaleOption(data, y, 'y'),
      },
      plugins: {
        title: titlePlugin(title),
        legend: legendsPlugin(),
      },
    },
  });

  return new NextResponse(canvas.toBuffer(), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}

export const dynamic = 'force-dynamic';