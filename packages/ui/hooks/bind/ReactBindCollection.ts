import { BindingTypeEvent, Consume, KeyType } from './types';
import { BindBase } from './BindBase';
import { filter, Observable, Subscription } from 'rxjs';
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
      throw new BindKeyNotExistsError(key, this._key);
    }
    rv.current = nextValue(rv.current, value);
    rv.next(rv.current);
    this._eventBus.next([rv, key, BindingTypeEvent.UPDATED]);
  }

  subscribeAll (): Observable<[ReactiveValue<Data>, KeyType, BindingTypeEvent]>
  subscribeAll (consume: Consume<[Data, KeyType, BindingTypeEvent]>): Subscription
  subscribeAll (consume?: Consume<[Data, KeyType, BindingTypeEvent]>): Subscription | Observable<[ReactiveValue<Data>, KeyType, BindingTypeEvent]> {
    if (consume) {
      return this._eventBus
        .subscribe(([rv, key, event]) => {
          consume([rv.current, key, event]);
        });
    } else {
      return this._eventBus;
    }
  }

  subscribe (key: KeyType, next: (value: Data) => void) {
    return this._eventBus
      .pipe(filter(([, thisKey, event]) => key === thisKey && event === BindingTypeEvent.UPDATED))
      .subscribe(([value]) => next(value.current));
  }

  get rawValues () {
    return [...this._store.values()];
  }

  get values () {
    return this.rawValues.map(i => i.current);
  }

  get asRecord () {
    return [...this._store.entries()].reduce((record, [key, val]) => {
      record[key] = val.current;
      return record;
    }, {} as Record<KeyType, Data>);
  }
}
