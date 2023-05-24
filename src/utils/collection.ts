export type KeyOfType<Type, Field> = keyof {
  [P in keyof Type as Type[P] extends Field ? P : never]: any
}

export function arrayToMap<T extends Record<any, any>, K extends keyof T, V extends keyof T> (array: T[], key: K, value: V): Record<T[K], T[V]> {
  return array.reduce(collectMap(key, value), {} as Record<T[K], T[V]>);
}

export function arrayToReducedMap<T extends Record<any, any>, K extends keyof T, R> (array: T[], key: K, reducer: ((result: R, current: T) => R), init: () => R) {
  return array.reduce(collectReduceMap(key, reducer, init), {} as Record<T[K], R>);
}

export function groupBy<T extends Record<any, any>, K extends keyof T> (array: T[], key: K): Record<T[K], T[]> {
  return array.reduce(collectReduceMap(key, (arr: T[], item) => arr.concat(item), () => []), {} as Record<T[K], T[]>);
}

export function collectMap<T extends Record<any, any>, K extends keyof T, V extends keyof T> (key: K, value: V): (map: Record<T[K], T[V]>, current: T) => Record<T[K], T[V]> {
  return (map, current) => {
    map[current[key]] = current[value];
    return map;
  };
}

export function collectReduceMap<T extends Record<any, any>, K extends keyof T, R> (key: K, reducer: ((result: R, current: T) => R), init: () => R): (map: Record<T[K], R>, current: T) => Record<T[K], R> {
  return (map, current) => {
    const keyField = current[key];
    if (!map[keyField]) {
      map[keyField] = init();
    }
    map[current[key]] = reducer(map[keyField], current);
    return map;
  };
}

export function sortedEntries<V> (record: Record<string, V>) {
  return Object.entries(record)
    .sort((a, b) => a[0].localeCompare(b[0]));
}