import { BindingTypeEvent, Consume, KeyType } from './types';
import { BindBase } from './BindBase';
import { filter } from 'rxjs';
import { BindKeyNotExistsError } from './error';
import { SetStateAction } from 'react';
import { nextValue } from './utils';
import { ReactiveValue, ReactiveValueSubject } from './ReactiveValueSubject.ts';

export class ReactBindCollection<Data> extends BindBase<KeyType, ReactiveValue<Data>, [Data]> {
  constructor () {super();}

  protected initialize (value: Data) {
    return new ReactiveValueSubject(value);
  }

  update (key: KeyType, value: SetStateAction<Data>) {
    const rv = this._store.get(key);
    if (!rv) {
      throw new BindKeyNotExistsError(key);
    }
    rv.current = nextValue(rv.current, value);
    this._eventBus.next([rv, key, BindingTypeEvent.UPDATED]);
  }

  subscribeAll (consume: Consume<[Data, KeyType, BindingTypeEvent]>) {
    return this._eventBus
      .subscribe(([rv, key, event]) => {
        consume([rv.current, key, event]);
      });
  }

  subscribe (key: KeyType, next: (value: Data) => void) {
    return this._eventBus
      .pipe(filter(([, thisKey, event]) => key === thisKey && event === BindingTypeEvent.UPDATED))
      .subscribe(([value]) => next(value.current));
  }

  get values () {
    return [...this._store.values()].map(i => i.current);
  }

  get asRecord () {
    return [...this._store.entries()].reduce((record, [key, val]) => {
      record[key] = val.current;
      return record;
    }, {} as Record<KeyType, Data>);
  }
}
