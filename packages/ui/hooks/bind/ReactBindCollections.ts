import { ReactBindCollection } from './ReactBindCollection.ts';
import { BindKey } from './types';
import { createContext, useContext } from 'react';
import { BindBase } from './BindBase';
import { isDev } from '../../utils/dev.ts';

export class ReactBindCollections extends BindBase<BindKey, ReactBindCollection<any>> {
  constructor () {
    super();
  }

  protected initialize (): ReactBindCollection<any> {
    return new ReactBindCollection<any>();
  }

  static readonly default = new ReactBindCollections();
}

const Context = createContext<ReactBindCollections>(ReactBindCollections.default);

export function useReactBindCollections () {
  return useContext(Context);
}

declare global {
  interface Window {
    sc: ReactBindCollections;
    detectScErrors: () => void;
  }
}

window.sc = ReactBindCollections.default;
window.detectScErrors = () => {
  const collections = ReactBindCollections.default;
  setInterval(() => {
    requestIdleCallback(() => {
      // @ts-ignore
      if (collections._pendingStore.size > 0) {
        // @ts-ignore
        console.warn(`[error:detection]`, [...collections._pendingStore.keys()], 'are not initialized, make sure these keys are registered somewhere outside <Suspense />');
      }
      // @ts-ignore
      for (let [name, bind] of collections._store.entries()) {
        // @ts-ignore
        if (bind._pendingStore.size > 0) {
          // @ts-ignore
          console.warn(`[error:detection]`, [...collections._pendingStore.keys()].map(key => `${name}.${key}`), 'are not initialized, make sure these keys are registered somewhere outside <Suspense />');
        }
      }
    });
  }, 1000);
};

if (isDev) {
  window.detectScErrors();
}
