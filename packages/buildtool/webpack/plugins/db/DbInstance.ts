import Cache from '../../utils/cache.js';
import { cwd } from '../../utils/path.js';

type DbInstanceOptions = {
  type: 'mysql'
  name: string
  database: string
  env: string
}

export abstract class DbInstance<Pool> {
  cache: Cache;
  pool: Pool | undefined;
  connectError: Error | undefined;

  constructor (public readonly options: DbInstanceOptions) {
    this.cache = new Cache(options.name, cwd('.db'));
  }

  async open () {
    await this.cache.prepare();
    await this.cache.open();
    const database = process.env[this.options.env] || this.options.database;
    if (!database) {
      throw new Error(`Database ${this.options.name}'s is not configured.`);
    }
    if (!process.env.TIDB_USER || !process.env.TIDB_HOST || !process.env.TIDB_HOST || !process.env.TIDB_PORT) {
      this.connectError = new Error('TiDB integration was not configured. Check your vercel project config.');
      return;
    }
    const uri = `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:${process.env.TIDB_PORT}/${database}?timezone=Z&ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}`;

    try {
      this.pool = await this.createPool(uri);
    } catch (e) {
      this.connectError = e as Error;
    }
  };

  async close () {
    await this.cache.close();
    if (this.pool) {
      await this.closePool(this.pool);
    }
  }

  abstract createPool (envValue: string): Pool | Promise<Pool>

  abstract closePool (pool: Pool): void | Promise<void>

  abstract query (sql: string, values?: any[]): Promise<any[]>
}
