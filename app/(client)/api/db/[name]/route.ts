import config from '@/.osswrc.json';
import kv from '@/app/(client)/api/kv';
import { getDatabaseUri } from '@/utils/mysql';
import { Connection, createConnection } from 'mysql2/promise';
import { NextRequest, NextResponse } from 'next/server';
import * as process from 'process';

// TODO: use config
const db = config.db;

export async function POST (req: NextRequest, { params: { name } }: any) {
  let readonly = req.headers.get('X-Readonly') === 'true';

  if (!process.env.TIDB_USER || !process.env.TIDB_HOST || !process.env.TIDB_PASSWORD || !process.env.TIDB_PORT) {
    return NextResponse.json({
      message: 'TiDB integration was not configured. Check your vercel project config.',
    }, { status: 500 });
  }

  const target = db.find(db => db.name === name || db.database === name);

  if (!target) {
    return NextResponse.json({
      type: 'ERR_NOT_FOUND',
      message: `DB ${name} not found`,
    }, { status: 404 });
  }

  const database = process.env[target.env] || target.database;

  const { searchParams } = new URL(req.url);

  const force = searchParams.get('force');
  const use = searchParams.get('use') ?? '';
  const sql = await req.text();
  const cacheKey = `${name}:${use}:${sql}`;

  const uri = getDatabaseUri(database, readonly, use);

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
      // console.error(e);
    }
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
      });
    }
  }

  let conn: Connection;
  try {
    conn = await createConnection(uri);
  } catch (e) {
    let msg = String((e as any)?.message ?? e);
    if (msg.startsWith('Access denied for user')) {
      msg = 'Access denied';
      console.error(e);
    }

    return NextResponse.json({
      code: 'ERR_CONN',
      message: `Connecting to database failed: ${msg}`,
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
      // console.error(e);
    }
    return NextResponse.json(data);

  } catch (e) {
    return NextResponse.json({
      type: 'ERR_EXEC',
      message: String((e as any)?.message ?? String(e)),
    }, {
      status: 400,
    });
  } finally {
    conn.destroy();
  }
}
