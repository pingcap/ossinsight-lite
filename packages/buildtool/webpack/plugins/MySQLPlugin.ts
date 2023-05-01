import { Compiler, WebpackPluginInstance } from 'webpack';
import { createPool, Pool } from 'mysql2/promise';
import Cache from '../utils/cache';
import { getEnv } from '../utils/env';

const db: {
  pool: Pool
  cache: Cache
} = {} as any;

const PLUGIN_NAME = 'MySQLPlugin';

class MySQLPlugin implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, async () => {
      if (!db.pool) {
        const DATABASE_URL = getEnv('DATABASE_URL');
        db.pool = createPool(DATABASE_URL as string);
        db.cache = new Cache('queries', '.db');
        await db.cache.prepare();
        await db.cache.open();
      }
    });
    compiler.hooks.shutdown.tapPromise(PLUGIN_NAME, async () => {
      await db.cache.close();
      try {
        await db.pool.end();
      } catch {}
    });
  }
}

export default MySQLPlugin;

export { db };
