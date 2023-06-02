import { createContext } from 'react';
import config from '../../../.osswrc.json';

export type AppContextValues = {
  availableDatabaseNames: string[]
  getDatabaseByName (name: string): string
}

/**
 * @deprecated
 */
const AppContext = createContext<AppContextValues>({
  availableDatabaseNames: config.db.map(db => db.name),
  getDatabaseByName: (name: string) => {
    const db = config.db.find(db => db.name === name);
    if (!db) {
      return '__UNKNOWN__'
    }
    return process.env[db.env] || db.database
  },
});

export default AppContext;
