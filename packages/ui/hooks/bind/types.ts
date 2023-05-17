export interface BindMap {
}

export type KeyType = string | number | symbol;

export type BindKey = keyof BindMap;
export type BindValue<K extends BindKey> = BindMap[K];

export type PureCallback = () => void;
export type Consume<T> = (value: T) => void;
export type Getter<T> = () => T;
export type ValueOrGetter<T> = T | Getter<T>;
export type Compare<T> = (lhs: T, rhs: T) => boolean;
export type ComparePath<T, K extends keyof T> = (lhs: T, rhs: T, path: K) => boolean;

export enum BindingTypeEvent {
  CREATED,
  DELETED,
  UPDATED,
}

// BindBase will auto call Disposable.dispose when delete an item.
export interface Disposable {
  dispose ();
}

export {};
