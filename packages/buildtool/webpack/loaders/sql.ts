import * as path from 'node:path';
import { LoaderDefinitionFunction } from 'webpack';
import { DbInstance } from '../plugins/db/DbInstance.js';

const { dbInstances } = require('../plugins/db/SQLPlugin.js');

const loader: LoaderDefinitionFunction = function (content, sourceMap, additionalData) {
  const cb = this.async();

  const load = async () => {
    const id = path.relative(path.join(process.cwd(), 'src/widgets'), this.remainingRequest);
    const firstLine = content.trim().split('\n', 1)[0].trim();
    let dbi: DbInstance<any> | undefined;
    if (firstLine.startsWith('--')) {
      const matched = /db:([\w\-]+)/.exec(firstLine);
      if (matched) {
        const [, name] = matched;
        dbi = dbInstances[name];
        if (!dbi) {
          this.emitError(new Error(`db:${name} not configured`));
          return `export default null`;
        }
      }
    }
    if (!dbi) {
      dbi = dbInstances['default'];
    }

    if (!dbi) {
      this.emitError(new Error(`db:default not configured`));
      return `export default null`;
    }

    const data = await dbi.cache.get(id, async () => {
      return await sqlQuery(dbi!, id, content);
    });
    //
    // const jsonFileName = id.replace(/\.sql(?:\?unique)?$/, '.json');
    // this.emitFile(jsonFileName, JSON.stringify(data));
    if (data.__error__) {
      return `
        console.error("Prefetch sql failed", ${JSON.stringify(data.__error__)});
        export default new Proxy({}, { get() { throw new Error('Failed to execute sql: ' + ${JSON.stringify(data.__error__.message)}) } });
      `;
    } else {
      return `export default ${JSON.stringify(data, undefined, 2)};`;
    }
  };

  load()
    .then((content) => cb(null, content, sourceMap, additionalData))
    .catch(err => cb(err));
};

async function sqlQuery (dbInstance: DbInstance<any>, id: string, content: string) {
  try {
    let [raw] = await dbInstance.query(content);

    if (id.endsWith('?unique')) {
      if (raw.length !== 1) {
        throw new Error(`Database returned ${raw.length} result(s).`);
      }
      raw = raw[0];
    }

    return raw;
  } catch (e) {
    return { __error__: e };
  }
}

export = loader;