import { loadEnv, Plugin } from 'vite';
import Cache from './cache.js';
import { mysqlCanHandleId, mysqlQuery } from './mysql.js';
import { createPool, Pool } from 'mysql2/promise';

export interface MysqlPluginOptions {
  databaseUrl?: string;
  cachePath?: string;
}

export default function mysqlPlugin ({
  databaseUrl,
  cachePath = 'node_modules/.vite/widgets',
}: MysqlPluginOptions = {}): Plugin[] {

  let pool: Pool;
  const cache = new Cache('mysql-executor', cachePath);

  return [{
    name: 'mysql-executor',
    async buildStart () {
      await cache.prepare();
      await cache.open();
    },
    async buildEnd () {
      await pool.end();
      await cache.close();
    },
    configResolved (config) {
      databaseUrl = databaseUrl ?? loadEnv(config.mode, process.cwd(), 'DATABASE').DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL not configured');
      }
      pool = createPool(databaseUrl);
    },
    async load (id) {
      if (mysqlCanHandleId(id)) {
        const res = await cache.get(
          id,
          async () => mysqlQuery(pool, cachePath, id),
        );

        return `export default ${JSON.stringify(res, undefined, 2)}`;
      }
    },
  }];
}