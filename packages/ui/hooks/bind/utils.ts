import { Getter, ValueOrGetter } from './types';
import { SetStateAction } from 'react';

export function isPromiseLike (value: any): value is Promise<any> {
  if (value instanceof Promise) {
    return true;
  }

  return 'then' in value && 'cache' in value && 'all' in value;
}

export function getValue<T> (valueOrGetter: ValueOrGetter<T>): T {
  return typeof valueOrGetter === 'function' ? (valueOrGetter as Getter<T>)() : valueOrGetter;
}

export function nextValue<T> (prev: T, setStateAction: SetStateAction<T>) {
  if (typeof setStateAction === 'function') {
    return (setStateAction as (prev: T) => T)(prev);
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
