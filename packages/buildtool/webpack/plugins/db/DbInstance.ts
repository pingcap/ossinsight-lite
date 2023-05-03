import Cache from '../../utils/cache.js';
import { cwd } from '../../utils/path.js';
import { getEnv } from '../../utils/env.js';

type DbInstanceOptions = {
  type: 'mysql'
  name: string
  env: string
}

export abstract class DbInstance<Pool> {
  cache: Cache;
  pool!: Pool;

  constructor (public readonly options: DbInstanceOptions) {
    this.cache = new Cache(options.name, cwd('.db'));
  }

  async open () {
    await this.cache.prepare();
    await this.cache.open();
    const env = getEnv(this.options.env);
    if (!env) {
      throw new Error(`Environment ${this.options.env} not configured.`);
    }
    this.pool = await this.createPool(env);
  };

  async close () {
    await this.cache.close();
    await this.closePool(this.pool);
  }

  abstract createPool (envValue: string): Pool | Promise<Pool>

  abstract closePool (pool: Pool): void | Promise<void>

  abstract query (sql: string, values?: any[]): Promise<any[]>
}
