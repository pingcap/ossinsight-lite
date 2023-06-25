import { isDev } from '@/packages/ui/utils/dev';
import { ADMIN_DATABASE_NAME } from '@/utils/server/auth';
import { Connection, createPool, Pool, RowDataPacket } from 'mysql2/promise';

const pools: Record<string, Pool> = {};

function preparePool (uri: string): Pool {
  if (pools[uri]) {
    return pools[uri];
  }

  return pools[uri] = createPool({
    uri,
    connectionLimit: isDev ? 10 : 1,
  });
}

export class NoConnectionError extends Error {
  readonly isNoConnectionError = true;

  constructor () {
    super('Not connected to database.');
  }
}

export async function withConnection<R> (uri: string, run: (conn: Connection & SqlExecutor) => Promise<R>): Promise<R> {
  if (!uri) {
    throw new NoConnectionError();
  }
  const pool = preparePool(uri);
  const conn = await pool.getConnection();
  let tx = false;

  const originalBeginTransaction = conn.beginTransaction;
  conn.beginTransaction = () => {
    tx = true;
    return originalBeginTransaction.call(conn);
  };

  try {
    const result = await run(withSqlExecutor(conn));
    if (tx) {
      await conn.commit();
    }
    return result;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function sql<T> (templateStringsArray: TemplateStringsArray, ...args: any[]): Promise<T[]> {
  return withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql }) => (
    sql(templateStringsArray, ...args)
  ));
}

export namespace sql {
  export const unique = async <T> (templateStringsArray: TemplateStringsArray, ...args: any[]): Promise<T | null> => {
    const res = await sql<T>(templateStringsArray, ...args);
    if (res.length === 0) {
      return null;
    } else if (res.length > 1) {
      throw new Error('More than on rows returned.');
    }
    return res[0];
  };
}

export interface SqlExecutor {
  sql: SqlInterface;
}

export interface SqlInterface {
  <T> (templateStringsArray: TemplateStringsArray, ...args: any[]): Promise<(T & RowDataPacket)[]>;

  unique<T> (templateStringsArray: TemplateStringsArray, ...args: any[]): Promise<T & RowDataPacket | null>;
}

function withSqlExecutor (conn: Connection): Connection & SqlExecutor {
  const sql = (async <T> (template: TemplateStringsArray, ...args: any[]) => {
    let sql = '';
    let values: any[] = [];
    let i = 0;
    for (i = 0; i < template.length - 1; i++) {
      sql += template[i] + '?';
      values.push(args[i]);
    }

    sql += template[i];

    const [rows] = await conn.query<RowDataPacket[]>({
      sql,
      values,
    });

    return rows as (T & RowDataPacket)[];
  }) as SqlInterface;
  sql.unique = async <T> (templateStringsArray: TemplateStringsArray, ...args: any[]): Promise<T | null> => {
    const res = await sql<T>(templateStringsArray, ...args);
    if (res.length === 0) {
      return null;
    } else if (res.length > 1) {
      throw new Error('More than on rows returned.');
    }
    return res[0];
  };

  (conn as Connection & SqlExecutor).sql = sql;

  return (conn as Connection & SqlExecutor);
}

export function getDatabaseUri (database?: string, readonly: boolean = false, use?: string) {
  if (!process.env.TIDB_USER || !process.env.TIDB_PASSWORD || !process.env.TIDB_HOST || !process.env.TIDB_PORT) {
    console.error('TiDB integration was not configured. Check your vercel project config.');
    return '';
  }
  const username = readonly ? process.env.TIDB_USER.replace(/\.[^.]*$/, '.osslreadonly') : process.env.TIDB_USER;
  const password = readonly ? process.env.TIDB_PASSWORD + '.osslreadonly' : process.env.TIDB_PASSWORD;
  if (database) {
    return `mysql://${username}:${password}@${process.env.TIDB_HOST}:${process.env.TIDB_PORT}/${use || database}?timezone=Z&ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}`;
  } else {
    return `mysql://${username}:${password}@${process.env.TIDB_HOST}:${process.env.TIDB_PORT}${use ? `/${use}` : ''}?timezone=Z&ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}`;
  }
}
