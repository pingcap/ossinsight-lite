export type BindingValueKeyPath<T> = [] | [keyof T] | any[];

export type ExtractBindingValuePath<T, P extends BindingValueKeyPath<T>> =
  P extends []
    ? T
    : P extends [infer K extends keyof T]
      ? T[K]
      : P extends [infer K extends keyof T, ...infer Rest]
        ? ExtractBindingValuePath<T[K], Rest>
        : never;

export function getPath<T, P extends BindingValueKeyPath<T>> (value: T, path: P): ExtractBindingValuePath<T, P> {
  if (value == null) {
    return value as any;
  }
  if (path.length === 0) {
    return value as any;
  } else {
    const cursor = value[path[0]];
    if (cursor == null) {
      return cursor;
    }
    if (path.length === 1) {
      return cursor;
    }
    return getPath(cursor, path.slice(1));
  }
}
