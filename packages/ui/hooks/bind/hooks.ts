import { BindKey, BindValue, Compare, ComparePath, Consume, KeyType, ValueOrGetter } from './types';
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { getValue, isPromiseLike, pick } from './utils';
import { useReactBindCollections } from './ReactBindCollections';
import { BindBase } from './BindBase';
import { ReactBindCollection } from './ReactBindCollection.ts';
import { BindKeyDuplicatedError } from './error';
import { Unsubscribable } from 'rxjs';
import { ReactiveValue } from './ReactiveValueSubject.ts';

function useEffectCallback<Callback extends (...args: any[]) => any> (cb: Callback): Callback {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });

  return useCallback(((...args) => {
    return ref.current(...args);
  }) as Callback, []);
}

function wrapPromise<T> (promise: Promise<T>) {
  let status = 'pending';
  let response;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    },
  );
  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };

  return { read };
}

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

export function useAsyncCollection<K extends BindKey> (type: K): Promise<ReactBindCollection<BindValue<K>>> {
  const collectionOrPromise = useReactBindCollections();
  return Promise.resolve(collectionOrPromise.get(type));
}

export function useCollectionKeys<Data> (collection: ReactBindCollection<Data>) {
  const requireLoad = useRef(collection.isNeedLoaded);
  const [keys, setKeys] = useState<KeyType[]>(() => {
    return collection.keys;
  });

  useEffect(() => {
    let onceLoadSub: Unsubscribable | undefined;
    if (requireLoad) {
      onceLoadSub = collection.onceLoaded(() => setKeys(collection.keys));
    }
    const subscription = collection.subscribeKeys(setKeys);
    return () => {
      subscription.unsubscribe();
      onceLoadSub?.unsubscribe();
    };
  }, []);

  return keys;
}

function collect<Data> (collection: ReactBindCollection<Data>): Record<KeyType, Data> {
  return [...collection.entries()].reduce((record, [key, subject]) => {
    record[key] = subject.current;
    return record;
  }, {} as Record<KeyType, Data>);
}

export function useCollectionValues<Data> (collection: ReactBindCollection<Data>): Record<KeyType, Data> {
  const [values, setValues] = useState<Record<KeyType, Data>>(() => collect(collection));

  useEffect(() => {
    const sub = collection.subscribeAll(() => {
      setValues(collect(collection));
    });

    return () => sub.unsubscribe();
  }, []);

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
  }, [id]);

  const update = useCallback((value: SetStateAction<BindValue<K>>) => {
    bind.update(id, value);
  }, [type, id]);

  return [state, update];
}

export function useWatchReactiveValue<V> (item: ReactiveValue<V>): V {
  const [value, setValue] = useState(item.current);

  useEffect(() => {
    const unsubscribable = item.subscribe({
      next: setValue,
    });

    return () => unsubscribable.unsubscribe();
  }, []);

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
  const [value, setValue] = useState(reactiveValue.current[path]);

  useEffect(() => {
    const unsubscribe = bind.subscribe(id, newValue => {
      const newPathValue = newValue[path];
      if (!compareFn(value, newPathValue)) {
        setValue(newPathValue);
      }
    });
    return () => unsubscribe.unsubscribe();
  }, []);

  return value;
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
  }, []);

  return fields;
}

export function useUpdater<K extends BindKey> (type: K, id: KeyType) {
  const bind = useCollection(type);

  return useEffectCallback((value: SetStateAction<BindValue<K>>) => {
    bind.update(id, value);
  });
}
