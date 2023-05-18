import { Getter, ValueOrGetter } from './types';

export type UpdateContext<Data> = { changed: boolean, changedKeys?: (`${string & keyof Data}${string}`)[] };
export type UpdateAction<Data> = Data | ((prevState: Data, ctx: UpdateContext<Data>) => Data)

export function isPromiseLike (value: any): value is Promise<any> {
  if (value instanceof Promise) {
    return true;
  }

  return 'then' in value && 'cache' in value && 'all' in value;
}

export function getValue<T> (valueOrGetter: ValueOrGetter<T>): T {
  return typeof valueOrGetter === 'function' ? (valueOrGetter as Getter<T>)() : valueOrGetter;
}

export function nextValue<T, C> (prev: T, setStateAction: UpdateAction<T>, context: C) {
  if (typeof setStateAction === 'function') {
    return (setStateAction as (prev: T, ctx: C) => T)(prev, context);
  } else {
    return setStateAction;
  }
}

export function pick<T, K extends keyof T> (value: T, fields: K[]): Readonly<Pick<T, K>> {
  return Object.freeze(fields.reduce((picked, field) => {
    picked[field] = value[field];
    return picked;
  }, {} as Pick<T, K>));
}
