import { VercelRequest, VercelResponse } from '@vercel/node';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createConnection } from 'mysql2/promise';

export default async function (req: VercelRequest, res: VercelResponse) {
  const name = req.query.name;
  if (typeof name !== 'string') {
    res.status(400).write('Bad param name. requires a string.');
    res.end();
    return;
  }
  try {
    const content = await fsp.readFile(path.join('widgets/oh-my-github', name), { encoding: 'utf-8' });

    const conn = await createConnection(process.env.DATABASE_URL);
    try {
      const [raw] = await conn.query(content)
      res.status(200).json(raw);
    } finally {
      conn.destroy();
    }
  } catch (e: any) {
    if (e?.error === -2) {
      res.status(404).end();
    } else {
      throw e;
    }
  }
}