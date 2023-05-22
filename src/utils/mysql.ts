import { Connection, createConnection } from 'mysql2/promise';

export async function withConnection<R> (uri: string, run: (conn: Connection) => Promise<R>): Promise<R> {
  const conn = await createConnection(uri);
  try {
    return await run(conn);
  } finally {
    conn.destroy();
  }
}

export function getDatabaseUri (database?: string) {
  if (!process.env.TIDB_USER || !process.env.TIDB_HOST || !process.env.TIDB_HOST || !process.env.TIDB_PORT) {
    throw new Error('TiDB integration was not configured. Check your vercel project config.');
  }
  if (database) {
    return `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:${process.env.TIDB_PORT}/${database}?timezone=Z&ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}`;
  } else {
    return `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:${process.env.TIDB_PORT}?timezone=Z&ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}`;
  }
}
