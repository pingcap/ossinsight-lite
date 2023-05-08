import { DbInstance } from './DbInstance.js';
import { createPool, Pool } from 'mysql2/promise';

export class MysqlInstance extends DbInstance<Pool> {
  override async closePool (pool: Pool): Promise<void> {
    try {
      await pool.end();
    } catch {}
  }

  override createPool (envValue: string): Promise<Pool> | Pool {
    return createPool(envValue);
  }

  override query (sql: string, values: any[] | undefined): Promise<any[]> {
    return this.pool.query(sql, values);
  }
}
