import { filter, firstValueFrom, map, Observable, Subject, Subscription, Unsubscribable } from 'rxjs';
import { isDev } from '../../utils/dev';
import { BindKeyDuplicatedError, BindKeyNotExistsError } from './error';
import { ReactiveValueSubject } from './ReactiveValueSubject';
import { BindingTypeEvent, Consume, Disposable, KeyType, PureCallback } from './types';

type TypedEntry<MapType, K extends keyof MapType> = [K, MapType[K]];

interface TypedMap<MapType> extends Map<keyof MapType, MapType[keyof MapType]> {
  readonly size: number;

  get<K extends keyof MapType> (key: K): MapType[K] | undefined;

  set<K extends keyof MapType> (key: K, value: MapType[K]): this;

  has (key: keyof MapType): boolean;

  delete (key: keyof MapType): boolean;

  clear (): void;

  entries (): IterableIterator<TypedEntry<MapType, keyof MapType>>;

  keys (): IterableIterator<keyof MapType>;

  values (): IterableIterator<MapType[keyof MapType]>;
}

class BindBaseSubject<T> extends Subject<T> {
  private _active: boolean = true;

  constructor () {
    super();
  }

  public set active (active: boolean) {
    this._active = active;
  }

  next (value: T) {
    if (this._active) {
      super.next(value);
    }
  }
}

export abstract class BindBase<BindMap, InitialArgs extends any[] = []> {
  protected readonly _store: TypedMap<BindMap> = new Map();
  protected readonly _pendingStore: TypedMap<{ [P in keyof BindMap]: Promise<BindMap[P]> }> = new Map();
  protected readonly _predefinedStore: TypedMap<{ [P in keyof BindMap]: () => Promise<InitialArgs> }> = new Map();
  protected readonly _eventBus = new BindBaseSubject<GeneralEvent<keyof BindMap, BindMap[keyof BindMap]>>();
  protected readonly _loaded = new ReactiveValueSubject<boolean>(true);
  public rejectUnknownKey = false;
  public fallback: (<K extends keyof BindMap> (key: K) => BindMap[K]) | undefined;

  _parent: BindBase<any, any> | undefined;
  _key: KeyType | undefined;

  protected constructor () {
  }

  entries () {
    return this._store.entries();
  }

  get keys () {
    return [...this._store.keys()];
  }

  getNullable<K extends keyof BindMap> (type: K): BindMap[K] | null {
    return this._store.get(type) ?? null;
  }

  get<K extends keyof BindMap> (type: K): BindMap[K] | Promise<BindMap[K]> {
    let rb = this._store.get(type);
    if (rb != null) {
      return rb;
    }
    let ab = this._pendingStore.get(type);
    if (ab == null) {
      let h: any;
      if (isDev) {
        const err = new Error(`key ${String(this._key ?? '?')}#${String(type)} Not resolved after 5 seconds. Check it.`);

        h = setTimeout(() => {
          console.error(err);
        }, 5000);
      }

      const pb = this._predefinedStore.get(type);
      if (pb != null) {
        this._pendingStore.set(type, ab = pb().then(initArgs => {
          if (isDev) {
            clearTimeout(h);
          }
          return this.add(type, ...initArgs);
        }));
      } else {
        if (this.rejectUnknownKey) {
          if (this.fallback) {
            const value = this.fallback(type);
            this._store.set(type, value);
            return value;
          } else {
            this._pendingStore.set(type, ab = Promise.reject(new Error(`Unknown ${String(this._key)}#${String(type)}`)));
          }
        } else {
          this._pendingStore.set(type, ab = firstValueFrom(this._eventBus
            .pipe(filter(([_, thisType, event]) => {
              if (isDev) {
                clearTimeout(h);
              }
              return event === BindingTypeEvent.CREATED && type === thisType;
            }))
            .pipe(map(([bind]) => bind as BindMap[K])),
          ));
        }
      }
    }
    return ab;
  }

  getOrCreate<K extends keyof BindMap> (type: K, getArgs: () => InitialArgs): BindMap[K] {
    const value = this.getNullable(type);
    if (value) {
      return value;
    }
    return this.add(type, ...getArgs());
  }

  add<K extends keyof BindMap> (key: K, ...args: InitialArgs): BindMap[K] {
    if (this._store.has(key)) {
      throw new BindKeyDuplicatedError(key);
    }
    const value = this.initialize<K>(...args);
    if (value instanceof BindBase) {
      value._parent = this;
      value._key = key;
    }
    this._store.set(key, value);
    this._pendingStore.delete(key);
    this._eventBus.next([value, key, BindingTypeEvent.CREATED]);
    return value;
  }

  define<K extends keyof BindMap> (key: K, getArgs: () => Promise<InitialArgs>) {
    this._predefinedStore.set(key, getArgs);
  }

  has (key: keyof BindMap) {
    return this._store.has(key);
  }

  del (key: keyof BindMap) {
    const value = this._store.get(key);
    if (!value) {
      throw new BindKeyNotExistsError(key, this._key);
    }
    if (isDisposable(value)) {
      value.dispose();
    }
    this._store.delete(key);
    this._eventBus.next([value, key, BindingTypeEvent.DELETED]);

    if (isDev) {
      if (value instanceof BindBase) {
        if (value._store.size > 0) {
          console.warn(`[bind-dev-leak-detect] Bind ${String(this._key ?? 'ROOT')}#${String(key)} not released all subscribers when deleted.`, value.keys);
        }
        if (value._pendingStore.size > 0) {
          console.warn(`[bind-dev-leak-detect] Bind ${String(this._key ?? 'ROOT')}#${String(key)} not released all subscribers when deleted.`, value.keys);
        }
      }
    }
  }

  delAll () {
    this._store.forEach((_, k) => {
      this.del(k);
    });
  }

  get events () {
    return this._eventBus;
  }

  subscribeKeys (): Observable<(keyof BindMap)[]>
  subscribeKeys (cb: Consume<(keyof BindMap)[]>): Subscription
  subscribeKeys (cb?: Consume<(keyof BindMap)[]>): Subscription | Observable<(keyof BindMap)[]> {
    if (cb) {
      return this._eventBus
        .pipe(filter(isKeyMutateEvent))
        .subscribe(() => {
          cb(this.keys);
        });
    } else {
      return this._eventBus
        .pipe(filter(isKeyMutateEvent))
        .pipe(map(() => this.keys));
    }
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
    this._loaded.current = true;
    this._loaded.markMutating();
  }

  get isNeedLoaded () {
    return !this._loaded.current;
  }

  onceLoaded (cb: PureCallback): Unsubscribable {
    if (this._loaded.current) {
      cb();
      return {
        unsubscribe () {},
      };
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

  inactiveScope<T> (cb: () => T): T {
    try {
      this._eventBus.active = false;
      return cb();
    } finally {
      this._eventBus.active = true;
    }
  }

  protected abstract initialize<K extends keyof BindMap> (...args: InitialArgs): BindMap[K];
}

export type GeneralEvent<Key, Value> = [Value, Key, BindingTypeEvent];

const keyMutateEvents = [BindingTypeEvent.CREATED, BindingTypeEvent.DELETED];

function isKeyMutateEvent<K, V> ([, , type]: GeneralEvent<K, V>) {
  return keyMutateEvents.includes(type);
}

function isDisposable (v: any): v is Disposable {
  return v && typeof v === 'object' && typeof (v as Disposable).dispose === 'function';
}
