import { createContext } from 'react';
import config from '../../../.osswrc.json';

export type AppCurrentUser = {
  login: string
  bio: string
  avatar_url: string
}

export type AppContextValues = {
  currentUser: AppCurrentUser
  availableDatabaseNames: string[]
  getDatabaseByName (name: string): string
}

/**
 * @deprecated
 */
const AppContext = createContext<AppContextValues>({
  currentUser: {
    login: 'unknown',
    bio: 'unknown',
    avatar_url: 'unknown',
  },
  availableDatabaseNames: ['github_personal', 'github_repos'],
  getDatabaseByName: (name: string) => {
    const db = config.db.find(db => db.name === name || db.database === name);
    if (!db) {
      return '__UNKNOWN__';
    }
    return process.env[db.env] || db.database;
  },
});

export default AppContext;
