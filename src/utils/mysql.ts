import { Connection, createConnection, RowDataPacket } from 'mysql2/promise';

export async function withConnection<R> (uri: string, run: (conn: Connection & SqlExecutor) => Promise<R>): Promise<R> {
  const conn = await createConnection( {
    uri,
  });
  let tx = false;

  const originalBeginTransaction = conn.beginTransaction;
  conn.beginTransaction = () => {
    tx = true;
    return originalBeginTransaction.call(conn);
  };

  try {
    const result = await run(withSqlExecutor(conn));
    if (tx) {
      conn.commit();
    }
    return result;
  } catch (e) {
    conn.rollback();
    throw e;
  } finally {
    conn.destroy();
  }
}

interface SqlExecutor {
  sql<T> (templateStringsArray: TemplateStringsArray, ...args: any[]): Promise<(T & RowDataPacket)[]>;
}

function withSqlExecutor (conn: Connection): Connection & SqlExecutor {
  (conn as Connection & SqlExecutor).sql = async <T> (template: TemplateStringsArray, ...args: any[]) => {
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
  };

  return (conn as Connection & SqlExecutor);
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
