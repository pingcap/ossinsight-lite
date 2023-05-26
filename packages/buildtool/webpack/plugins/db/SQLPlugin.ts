import { Compiler, WebpackPluginInstance } from 'webpack';
import { getConfig } from '../../../utils/config.js';
import { DbInstance } from './DbInstance.js';
import { MysqlInstance } from './mysql.js';

const PLUGIN_NAME = 'SQLPlugin';
const dbInstances: Record<string, DbInstance<any>> = {};

class SQLPlugin implements WebpackPluginInstance {
  static dbInstances = dbInstances;

  apply (compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, async () => {
      if (!connected) {
        await initialize();
        await Promise.all(Object.values(dbInstances).map((db) => db.open()));
        connected = true;
      }
    });
    compiler.hooks.shutdown.tapPromise(PLUGIN_NAME, async () => {
      await Promise.all(Object.values(dbInstances).map((db) => db.close()));
    });
  }
}

async function initialize () {
  const config = await getConfig();
  if (config.db) {
    for (const options of config.db) {
      switch (options.type) {
        case 'mysql':
          dbInstances[options.name] = new MysqlInstance(options);
      }
    }
  }
}

let connected = false;

export = SQLPlugin;
