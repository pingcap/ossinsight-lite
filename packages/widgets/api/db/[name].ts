import { VercelRequest, VercelResponse } from '@vercel/node';
import { Connection, createConnection } from 'mysql2/promise';
import * as process from 'process';
import kv from '@vercel/kv';

// TODO: use config
const db = [
  {
    'name': 'oh-my-github',
    'env': 'OH_MY_GITHUB_DATABASE_URL',
  },
  {
    'name': 'repo-track',
    'env': 'REPO_TRACK_DATABASE_URL',
  },
];

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const target = db.find(db => db.name === req.query.name);

  if (!target) {
    res.status(400).end();
    return;
  }

  const ignoreCache = req.query.force === 'true';
  const cacheKey = `${req.query.name}:${req.body}`;

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
      res.status(200);
      res.json({ ...cached, cached: true });
      res.end();
      return;
    }
  }

  const dbUri = process.env[target.env];
  if (!dbUri) {
    res.status(500).json({ reason: `${target.env} not configured` });
    return;
  }

  let conn: Connection;
  try {
    conn = await createConnection(dbUri);
  } catch (e) {
    console.error(`${target.env} =`, dbUri.slice(dbUri.indexOf('prod.aws.tidbcloud.com')));
    res.status(500).json({ reason: String(e?.message ?? e) });
    return;
  }

  try {
    const start = Date.now();
    const result = await conn.execute(req.body);
    const end = Date.now();
    const data = {
      data: result[0],
      columns: result[1].map(col => ({ name: col.name, type: col.type })),
      startAt: start,
      endAt: end,
      spent: end - start,
      ttl: 1800,
    };
    try {
      await kv.setex(cacheKey, 1800, data);
    } catch (e) {
      // ignore if kv not configured.
      console.error(e);
    }
    res.status(200);
    res.json(data);
    res.end();

  } catch (e) {
    try {
      res.status(400);
      res.json(e?.message ?? String(e));
      res.end();
    } catch (ie) {
      console.error(e);
      console.error(ie);
    }
  } finally {
    conn.destroy();
  }
}
