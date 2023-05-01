import { LoaderDefinitionFunction, PitchLoaderDefinitionFunction } from 'webpack';
import { db } from '../plugins/MySQLPlugin';
import * as path from 'node:path';
import { Pool } from 'mysql2/promise';
// import Cache from '../cache';

// const cachePath = 'node_modules/.widgets'
//
// const cache = new Cache('mysql', cachePath);

const loader: LoaderDefinitionFunction = function (content, sourceMap, additionalData) {
  const cb = this.async();

  const load = async () => {
    const id = path.relative(path.join(process.cwd(), 'src/widgets'), this.remainingRequest);
    const data = await db.cache.get(id, async () => {
      return await mysqlQuery(db.pool, id, content);
    });
    //
    // const jsonFileName = id.replace(/\.sql(?:\?unique)?$/, '.json');
    // this.emitFile(jsonFileName, JSON.stringify(data));
    return `export default ${JSON.stringify(data, undefined, 2)};`;
  };

  load()
    .then((content) => cb(null, content, sourceMap, additionalData))
    .catch(err => cb(err));
};

async function mysqlQuery (pool: Pool | undefined, id: string, content: string) {
  if (pool == null) {
    throw new Error('databaseUrl must be configured to import sql file');
  }

  let [raw] = await pool.query<any[]>(content);

  if (id.endsWith('?unique')) {
    if (raw.length !== 1) {
      throw new Error(`Database returned ${raw.length} result(s).`);
    }
    raw = raw[0];
  }

  return raw;
}

export default loader;