import { VercelRequest, VercelResponse } from '@vercel/node';
import { createConnection } from 'mysql2/promise';
import * as process from 'process';

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

  const dbUri = process.env[target.env];
  if (!dbUri) {
    res.status(500).json({ reason: `${target.env} not configured` })
  }

  const conn = await createConnection(dbUri);

  try {
    const start = Date.now();
    const result = await conn.execute(req.body);
    const end = Date.now();
    res.status(200);
    res.json({
      data: result[0],
      columns: result[1].map(col => ({ name: col.name, type: col.type })),
      startAt: start,
      endAt: end,
      spent: end - start,
    });
    res.end();
  } catch (e) {
    res.status(400);
    res.json(e?.message ?? String(e));
    res.end();
  } finally {
    conn.destroy();
  }
}
