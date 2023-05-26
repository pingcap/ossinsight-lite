import { createPool, Pool } from 'mysql2/promise';
import { DbInstance } from './DbInstance.js';

export class MysqlInstance extends DbInstance<Pool> {
  override async closePool (pool: Pool): Promise<void> {
    try {
      await pool.end();
    } catch {
    }
  }

  override createPool (envValue: string): Promise<Pool> | Pool {
    return createPool(envValue);
  }

  override query (sql: string, values: any[] | undefined): Promise<any[]> {
    if (this.connectError) {
      return Promise.reject(this.connectError);
    }
    if (!this.pool) {
      return Promise.reject(new Error('Not connected to database.'));
    }
    return this.pool.query(sql, values);
  }
}
