import { ReactBindCollection } from './ReactBindCollection.tsx';
import { BindKey } from './types';
import { createContext, useContext, useMemo } from 'react';
import { BindBase } from './BindBase';
import { isDev } from '../../utils/dev.ts';

const NO_DEP: [] = [];

export interface ReactBindParentProps {

}

export function ReactBindCollections () {
  const collections = useMemo(() => new ReactBindCollectionsContext(), NO_DEP);

  return (
    <Context.Provider value={collections} />
  );
}

export class ReactBindCollectionsContext extends BindBase<BindKey, ReactBindCollection<any>> {
  constructor () {
    super();
  }

  protected initialize (): ReactBindCollection<any> {
    return new ReactBindCollection<any>();
  }

  static readonly default = new ReactBindCollectionsContext();
}

const Context = createContext<ReactBindCollectionsContext>(ReactBindCollectionsContext.default);

export function useReactBindCollections () {
  return useContext(Context);
}

declare global {
  interface Window {
    sc: ReactBindCollectionsContext;
    detectScErrors: () => void;
  }
}

window.sc = ReactBindCollectionsContext.default;
window.detectScErrors = () => {
  const collections = ReactBindCollectionsContext.default;
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
