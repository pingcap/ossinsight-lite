import { createContext, useContext } from 'react';
import { ReactBindCollections } from './ReactBindCollections';
import { ReactBindSingletons } from './ReactBindSingletons';

const CollectionContext = createContext(ReactBindCollections.default);

export function useReactBindCollections () {
  return useContext(CollectionContext);
}

const SingletonContext = createContext(ReactBindSingletons.default);

export function useReactBindSingletons () {
  return useContext(SingletonContext);
}
