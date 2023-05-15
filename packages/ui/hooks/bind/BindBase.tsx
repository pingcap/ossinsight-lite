import { filter, firstValueFrom, map, Subject, Unsubscribable } from 'rxjs';
import { BindingTypeEvent, Consume, KeyType, PureCallback } from './types';
import { BindKeyDuplicatedError, BindKeyNotExistsError } from './error';
import { ReactiveValueSubject } from './ReactiveValueSubject.ts';

export abstract class BindBase<Key extends KeyType, Value, InitialArgs extends any[] = []> {
  protected readonly _store = new Map<Key, Value>();
  protected readonly _pendingStore = new Map<Key, Promise<Value>>();
  protected readonly _eventBus = new Subject<GeneralEvent<Key, Value>>();
  protected readonly _loaded = new ReactiveValueSubject<boolean>(true);

  _parent: BindBase<any, any, any> | undefined;
  _key: Key | undefined;

  protected constructor () {
  }

  entries () {
    return this._store.entries();
  }

  get keys () {
    return [...this._store.keys()];
  }

  getNullable (type: Key): Value | null {
    return this._store.get(type) ?? null;
  }

  get (type: Key): Value | Promise<Value> {
    let rb = this._store.get(type);
    if (rb != null) {
      return rb;
    }
    let ab = this._pendingStore.get(type);
    if (ab == null) {
      this._pendingStore.set(type, ab = firstValueFrom(this._eventBus
        .pipe(filter(([_, thisType, event]) => {
          return event === BindingTypeEvent.CREATED && type === thisType;
        }))
        .pipe(map(([bind]) => bind)),
      ));
    }
    return ab;
  }

  add (key: Key, ...args: InitialArgs) {
    if (this._store.has(key)) {
      throw new BindKeyDuplicatedError(key);
    }
    const value = this.initialize(...args);
    if (value instanceof BindBase) {
      value._parent = this;
      value._key = key;
    }
    this._store.set(key, value);
    this._pendingStore.delete(key);
    this._eventBus.next([value, key, BindingTypeEvent.CREATED]);
    return value;
  }

  has (key: Key) {
    return this._store.has(key);
  }

  del (key: Key) {
    const value = this._store.get(key);
    if (!value) {
      throw new BindKeyNotExistsError(key);
    }
    this._store.delete(key);
    this._eventBus.next([value, key, BindingTypeEvent.DELETED]);
  }

  subscribeKeys (cb: Consume<Key[]>) {
    return this._eventBus
      .pipe(filter(isKeyMutateEvent))
      .subscribe(() => {
        cb(this.keys);
      });
  }

  needLoaded () {
    this._loaded.current = false;
    this._loaded.markMutating();
  }

  markLoaded () {
    this._loaded.next(true);
    this._loaded.current = true;
    this._loaded.markReadonly();
  }

  resetLoaded () {
    this._loaded.current = true
    this._loaded.markMutating();
  }

  get isNeedLoaded () {
    return this._loaded.current
  }

  onceLoaded (cb: PureCallback): Unsubscribable {
    if (this._loaded.current) {
      cb();
      return {
        unsubscribe () {}
      }
    } else {
      const sub = this._loaded.subscribe((loaded) => {
        if (loaded) {
          cb();
          sub.unsubscribe();
        }
      });
      return sub;
    }
  }

  protected abstract initialize (...args: InitialArgs): Value;
}

type GeneralEvent<Key, Value> = [Value, Key, BindingTypeEvent];

const keyMutateEvents = [BindingTypeEvent.CREATED, BindingTypeEvent.DELETED];

function isKeyMutateEvent<K, V> ([, , type]: GeneralEvent<K, V>) {
  return keyMutateEvents.includes(type);
}
