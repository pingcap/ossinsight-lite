import { Pool } from 'mysql2/promise';
import fsp from 'fs/promises';

export function mysqlCanHandleId (id: string) {
  return id.endsWith('.sql') || id.endsWith('.sql?unique');
}

export async function mysqlQuery (pool: Pool | undefined, cachePath: string, id: string) {
  if (pool == null) {
    throw new Error('databaseUrl must be configured to import sql file');
  }
  const content = await fsp.readFile(id.replace(/\?unique$/, ''), { encoding: 'utf-8' });
  let [raw] = await pool.query<any[]>(content);

  if (id.endsWith('?unique')) {
    if (raw.length !== 1) {
      throw new Error(`Database returned ${raw.length} result(s).`);
    }
    raw = raw[0];
  }

  return raw;
}
