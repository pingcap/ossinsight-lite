import { BindKey, BindValue, Compare, ComparePath, Consume, KeyType, ValueOrGetter } from './types';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { getValue, isPromiseLike, pick } from './utils';
import { useReactBindCollections } from './ReactBindCollections';
import { BindBase } from './BindBase';
import { ReactBindCollection } from './ReactBindCollection.ts';
import { BindKeyDuplicatedError } from './error';
import { Unsubscribable } from 'rxjs';
import { ReactiveValue } from './ReactiveValueSubject.ts';

export function useAsync<T> (input: T | Promise<T>): T {
  if (isPromiseLike(input)) {
    throw input;
  } else {
    return input;
  }
}

function useBind<K extends KeyType, V, A extends any[]> (bindBase: BindBase<K, V, A>, key: K) {
  return useAsync(bindBase.get(key));
}

export function useCollection<K extends BindKey> (type: K): ReactBindCollection<BindValue<K>> {
  return useBind(useReactBindCollections(), type);
}

export function useReadItem<Data> (collection: ReactBindCollection<Data>, id: KeyType) {
  return useBind(collection, id);
}

export function useAsyncCollection<K extends BindKey> (type: K): Promise<ReactBindCollection<BindValue<K>>> {
  const collectionOrPromise = useReactBindCollections();
  return Promise.resolve(collectionOrPromise.get(type));
}

export function useCollectionKeys<Key extends KeyType, Data> (collection: BindBase<Key, Data, any>, watchAll = false) {
  const [keys, setKeys] = useState<Key[]>(() => {
    return collection.keys;
  });

  useEffect(() => {
    let onceLoadSub: Unsubscribable | undefined;
    setKeys(collection.keys);
    if (collection.isNeedLoaded) {
      onceLoadSub = collection.onceLoaded(() => setKeys(collection.keys));
    }
    const subscription = watchAll
      ? collection.events.subscribe(() => setKeys(collection.keys))
      : collection.subscribeKeys(setKeys);
    return () => {
      subscription.unsubscribe();
      onceLoadSub?.unsubscribe();
    };
  }, [collection]);

  return keys;
}

export function useCollectionValues<Data> (collection: ReactBindCollection<Data>): Data[] {
  const [values, setValues] = useState(() => collection.values);

  useEffect(() => {
    const sub = collection.subscribeAll(() => {
      setValues(collection.values);
    });

    return () => sub.unsubscribe();
  }, [collection]);

  return values;
}

export function useItem<K extends BindKey> (type: K, id: KeyType, initialValue: ValueOrGetter<BindValue<K>>): [BindValue<K>, Consume<SetStateAction<BindValue<K>>>] {
  const bind = useCollection(type);
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    if (bind.has(id)) {
      throw new BindKeyDuplicatedError(id);
    }
    bind.add(id, getValue(initialValue));
    const subscription = bind.subscribe(id, setState);
    return () => {
      subscription.unsubscribe();
      bind.del(id);
    };
  }, [bind, id]);

  const update = useCallback((value: SetStateAction<BindValue<K>>) => {
    bind.update(id, value);
  }, [type, id]);

  return [state, update];
}

export function useWatchReactiveValue<V> (item: ReactiveValue<V>): V {
  const [value, setValue] = useState(item.current);

  useEffect(() => {
    setValue(item.current);

    const unsubscribable = item.subscribe({
      next: setValue,
    });

    return () => unsubscribable.unsubscribe();
  }, [item]);

  return value;
}

export function useWatchReactiveValueField<V, Path extends keyof V> (item: ReactiveValue<V>, path: Path, compareFn: Compare<V[Path]> = Object.is): V[Path] {
  const [value, setValue] = useState(() => item.current[path]);

  useEffect(() => {
    setValue(item.current[path]);
    const unsubscribe = item.subscribe(newValue => {
      const newPathValue = newValue[path];
      if (!compareFn(value, newPathValue)) {
        setValue(newPathValue);
      }
    });
    return () => {
      unsubscribe.unsubscribe();
    };
  }, [item]);

  return value;
}

export function useWatchItem<K extends BindKey> (type: K, id: KeyType): BindValue<K> {
  const bind = useCollection(type);
  const reactiveValue = useBind(bind, id);
  return useWatchReactiveValue(reactiveValue);
}

function isBind<T> (value: any): value is ReactBindCollection<T> {
  return value instanceof ReactBindCollection;
}

export function useWatchItemField<K extends BindKey, Path extends keyof BindValue<K>> (type: K, id: KeyType, path: Path, compareFn: Compare<BindValue<K>[Path]> = Object.is): BindValue<K>[Path] {
  const bind = useCollection(type);
  const reactiveValue = useBind(bind, id);

  return useWatchReactiveValueField(reactiveValue, path, compareFn);
}

function defaultCompare (l: any, r: any, k: any): boolean {
  return Object.is(l[k], r[k]);
}

export function useWatchItemFields<K extends BindKey, Path extends keyof BindValue<K>> (target: K | ReactBindCollection<BindValue<K>>, id: KeyType, paths: Path[], compareFn: ComparePath<Pick<BindValue<K>, Path>, Path> = defaultCompare): Pick<BindValue<K>, Path> {
  const bind = isBind(target) ? target : useCollection(target);
  const reactiveValue = useBind(bind, id);
  const [fields, setFields] = useState(pick(reactiveValue.current, paths));

  useEffect(() => {
    let staledItem: Pick<BindValue<K>, Path> = pick(reactiveValue.current, paths);

    const unsubscribe = bind.subscribe(id, newItem => {
      let updated = false;
      for (let i = 0; i < paths.length; i++) {
        if (!compareFn(staledItem, newItem, paths[i])) {
          updated = true;
        }
      }
      if (updated) {
        staledItem = pick(newItem, paths);
        setFields(staledItem);
      }
    });
    return () => unsubscribe.unsubscribe();
  }, [target, id]);

  return fields;
}

export function useUpdater<K extends BindKey> (type: K, id: KeyType) {
  const bind = useCollection(type);

  return useCallback((value: SetStateAction<BindValue<K>>) => {
    bind.update(id, value);
  }, [bind, id]);
}
