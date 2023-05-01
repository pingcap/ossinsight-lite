import { Compiler, WebpackPluginInstance } from 'webpack';
import { createPool, Pool } from 'mysql2/promise';
import { parse as parseDotEnv } from 'dotenv';
import * as fs from 'fs';
import Cache from '../utils/cache';
import { cwd } from '../utils/path';

const db: {
  pool: Pool
  cache: Cache
} = {} as any;

const PLUGIN_NAME = 'MySQLPlugin'

class MySQLPlugin implements WebpackPluginInstance {
  apply (compiler: Compiler) {
    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, async () => {
      const { DATABASE_URL } = parseDotEnv(fs.readFileSync(cwd('.env.local')));
      if (!db.pool) {
        db.pool = createPool(DATABASE_URL as string);
        db.cache = new Cache('queries', '.db');
        await db.cache.prepare();
        await db.cache.open();
      }
    });
    compiler.hooks.afterCompile.tap(PLUGIN_NAME, async () => {
      await db.cache.close();
      await db.pool.end();
    });
  }
}

export default MySQLPlugin;

export { db };
