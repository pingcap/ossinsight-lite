import { Connection, createConnection } from 'mysql2/promise';
import * as process from 'process';
import kv from '@/app/api/kv';
import { NextRequest, NextResponse } from 'next/server';
import config from '@/.osswrc.json';

// TODO: use config
const db = config.db;

export async function POST (req: NextRequest, { params: { name } }: any) {
  const target = db.find(db => db.name === name);

  if (!target) {
    return NextResponse.json({
      type: 'ERR_NOT_FOUND',
      message: `DB ${name} not found`,
    }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);

  const force = searchParams.get('force');
  const sql = await req.text();
  const cacheKey = `${name}${sql}`;

  const ignoreCache = force === 'true';

  if (!ignoreCache) {
    let cached: any;
    try {
      cached = await kv.get(cacheKey);
      if (cached) {
        cached.ttl = await kv.ttl(cacheKey);
        cached.cached = true;
      }
    } catch (e) {
      console.error(e);
    }
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
      });
    }
  }

  const dbUri = process.env[target.env];
  if (!dbUri) {
    return NextResponse.json({
      code: 'ERR_SETUP',
      message: `${target.env} not configured`,
    }, { status: 500 });
  }

  let conn: Connection;
  try {
    conn = await createConnection(dbUri);
  } catch (e) {
    console.error(`${target.env} =`, dbUri.slice(dbUri.indexOf('prod.aws.tidbcloud.com')));
    return NextResponse.json({
      code: 'ERR_CONN',
      message: `Connecting to database failed: ${String((e as any)?.message ?? e)}`,
    }, { status: 500 });
  }

  try {
    const start = Date.now();
    const result = await conn.execute(sql);
    const end = Date.now();
    const data: any = {
      data: result[0],
      columns: result[1].map(col => ({ name: col.name, type: col.type })),
      startAt: start,
      endAt: end,
      spent: end - start,
    };
    try {
      await kv.setex(cacheKey, 1800, data);
      data.ttl = 1800;
    } catch (e) {
      // ignore if kv not configured.
      console.error(e);
    }
    return NextResponse.json(data);

  } catch (e) {
    return NextResponse.json({
      type: 'ERR_EXEC',
      message: String((e as any)?.message ?? String(e)),
    });
  } finally {
    conn.destroy();
  }
}
