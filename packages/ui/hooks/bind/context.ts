import { ReactBindSingletons } from './ReactBindSingletons';
import { ReactBindCollections } from './ReactBindCollections.ts';
import { CollectionBindKey, CollectionBindValue, SingletonBindKey } from './types.ts';
import { ReactBindCollection } from './ReactBindCollection.ts';
import { BindBase } from './BindBase.tsx';
import { isPromiseLike } from './utils.ts';

export const collections = ReactBindCollections.default;
export const singletons = ReactBindSingletons.default;

export function readBind<BindMap, K extends keyof BindMap, A extends any[]> (bindBase: BindBase<BindMap, A>, key: K): BindMap[K] {
  const bind = bindBase.get(key);
  if (isPromiseLike(bind)) {
    throw bind;
  } else {
    return bind;
  }
}

export function collection<K extends CollectionBindKey> (type: K): ReactBindCollection<CollectionBindValue<K>> {
  return readBind(collections, type);
}

export function singleton<K extends SingletonBindKey> (type: K) {
  return readBind(singletons, type);
}