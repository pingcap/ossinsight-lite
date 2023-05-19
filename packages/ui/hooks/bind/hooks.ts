import { BiConsume, BindingTypeEvent, CollectionBindKey, CollectionBindValue, Compare, ComparePath, Consume, KeyType, SingletonBindKey, ValueOrGetter } from './types';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { getValue, pick } from './utils';
import { collection, collections, readBind, singletons } from './context';
import { BindBase } from './BindBase';
import { ReactBindCollection } from './ReactBindCollection';
import { BindKeyDuplicatedError } from './error';
import { filter, map, Subscription, Unsubscribable } from 'rxjs';
import { ReactiveValue } from './ReactiveValueSubject';

export function whenReady<BindMap, K extends keyof BindMap, A extends any[]> (bindBase: BindBase<BindMap, A>, key: K, cb: BiConsume<BindMap[K], Subscription>): Subscription {
  const item = bindBase.getNullable(key);
  const subscription = new Subscription();

  if (item) {
    cb(item, subscription);
  } else {
    subscription.add(bindBase.events
      .pipe(filter(([_, type, ev]) => {
        return type === key && ev === BindingTypeEvent.CREATED;
      }))
      .pipe(map(([bind]) => bind))
      .subscribe(value => {
        cb(value as any, subscription);
      }));
  }
  return subscription;
}

function useOptionalBind<BindMap, K extends keyof BindMap, A extends any[]> (bindBase: BindBase<BindMap, A>, type: K): BindMap[K] | null {
  const [resolved, setResolved] = useState(() => bindBase.getNullable(type));

  useEffect(() => {
    setResolved(bindBase.getNullable(type));
    const sub = bindBase.events.subscribe(([bind, key, ev]) => {
      if (key !== type) {
        return;
      }
      switch (ev) {
        case BindingTypeEvent.DELETED:
          setResolved(null);
          break;
        case BindingTypeEvent.CREATED:
          setResolved(bind as any);
          break;
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return resolved;
}

export function useOptionalSingleton<K extends SingletonBindKey> (type: K) {
  return useOptionalBind(singletons, type);
}

export function useOptionalCollection<K extends CollectionBindKey> (type: K): ReactBindCollection<CollectionBindValue<K>> | null {
  return useOptionalBind(collections, type);
}

export function readItem<Data> (collection: ReactBindCollection<Data>, id: KeyType) {
  return readBind(collection, id);
}

export function useAsyncCollection<K extends CollectionBindKey> (type: K): Promise<ReactBindCollection<CollectionBindValue<K>>> {
  return Promise.resolve(collections.get(type));
}

export function useCollectionKeys<BindMap> (collection: BindBase<BindMap, any> | null | undefined, watchAll = false) {
  const [keys, setKeys] = useState<(keyof BindMap)[]>(() => {
    return collection?.keys ?? [];
  });

  useEffect(() => {
    if (collection == null) {
      setKeys([]);
      return;
    }
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

export function useItem<K extends CollectionBindKey> (type: K, id: KeyType, initialValue: ValueOrGetter<CollectionBindValue<K>>): [CollectionBindValue<K>, Consume<SetStateAction<CollectionBindValue<K>>>] {
  const bind = collection(type);
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

  const update = useCallback((value: SetStateAction<CollectionBindValue<K>>) => {
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
    let oldValue = item.current[path];
    const unsubscribe = item.subscribe(newValue => {
      const newPathValue = newValue[path];
      if (!compareFn(oldValue, newPathValue)) {
        setValue(newPathValue);
        oldValue = newPathValue;
      }
    });
return () => {
  unsubscribe.unsubscribe();
};
}, [item]);

return value;
}

export function useWatchItem<K extends CollectionBindKey> (type: K, id: KeyType): CollectionBindValue<K> {
  const bind = collection(type);
  const reactiveValue = readBind(bind, id);
  return useWatchReactiveValue(reactiveValue);
}

export function useWatchItemField<K extends CollectionBindKey, Path extends keyof CollectionBindValue<K>> (type: K, id: KeyType, path: Path, compareFn: Compare<CollectionBindValue<K>[Path]> = Object.is): CollectionBindValue<K>[Path] {
  const bind = collection(type);
  const reactiveValue = readBind(bind, id);

  return useWatchReactiveValueField(reactiveValue, path, compareFn);
}

function defaultCompare (l: any, r: any, k: any): boolean {
  return Object.is(l[k], r[k]);
}

export function useWatchItemFields<K extends CollectionBindKey, Path extends keyof CollectionBindValue<K>> (target: K, id: KeyType, paths: Path[], compareFn: ComparePath<Pick<CollectionBindValue<K>, Path>, Path> = defaultCompare): Pick<CollectionBindValue<K>, Path> {
  const bind = collection(target as K);
  const reactiveValue = readBind(bind, id);
  const [fields, setFields] = useState(pick(reactiveValue.current, paths));

  useEffect(() => {
    let staledItem: Pick<CollectionBindValue<K>, Path> = pick(reactiveValue.current, paths);

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

export function useUpdater<K extends CollectionBindKey> (type: K, id: KeyType) {
  const bind = collection(type);

  return useCallback((value: SetStateAction<CollectionBindValue<K>>) => {
    bind.update(id, value);
  }, [bind, id]);
}
