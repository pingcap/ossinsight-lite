import { isDev } from '../../utils/dev';
import { BindBase } from './BindBase';
import { ReactBindCollection } from './ReactBindCollection';
import { ReactBindSingletons } from './ReactBindSingletons';
import { CollectionsBindMap } from './types';

export class ReactBindCollections extends BindBase<{ [p in keyof CollectionsBindMap]: ReactBindCollection<CollectionsBindMap[p]> }> {
  static readonly default = new ReactBindCollections();
  readonly _key = 'collections';

  constructor () {
    super();
  }

  protected initialize (): any {
    return new ReactBindCollection();
  }
}

declare global {
  interface Window {
    sc: ReactBindCollections;
    ss: ReactBindSingletons;
    detectScErrors: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.ss = ReactBindSingletons.default;
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
            console.warn(`[error:detection]`, [...bind._pendingStore.keys()].map(key => `${name}#${key}`), 'are not initialized, make sure these keys are registered somewhere outside <Suspense />');
          }
        }
      });
    }, 1000);
  };

  if (isDev) {
    window.detectScErrors();
  }
}
