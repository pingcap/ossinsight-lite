import { SetStateAction } from 'react';
import { BindingSubject } from './hooks.ts';
import { Subject } from 'rxjs';

export interface BindingMap {
  '': never;
}

export interface ComponentBindingContextValues<K extends keyof BindingMap> {
  prefix: K;

  register (name: string, subject: BindingSubject<BindingMap[K]>);

  registerRaw (name: string, value: BindingMap[K]);

  unregister (name: string);

  unregisterRaw (name: string);

  unregisterAllRaw ();

  get (name: string): BindingSubject<BindingMap[K]> | undefined;

  update (name: string, valueOrFunc: SetStateAction<BindingMap[K]>);

  getAll (): Record<string, BindingMap[K]>;

  getAllNames (): string[];

  subscribeAll (cb: (type: AnyChangeType, target: string, current: BindingMap[K]) => void): () => void;

  subscribeAllNames (cb: (keys: string[]) => void): () => void;

}

export enum AnyChangeType {
  ADD_NAME = 'add_name',
  DEL_NAME = 'del_name',
  UPDATE = 'update',
}

function bound (_: any, { name, addInitializer }: ClassMethodDecoratorContext) {
  addInitializer(function () {
    this[name] = this[name].bind(this);
  });
}

class BindingContext<K extends keyof BindingMap> implements ComponentBindingContextValues<K> {
  public readonly anyChanges = new Subject<[type: AnyChangeType, name: string, current: BindingMap[K]]>();
  public readonly anyKeyChanges = new Subject<void>();
  public readonly map = new Map<string, BindingSubject<BindingMap[K]>>;

  constructor (public readonly prefix: K) {}

  @bound
  register (name, subject) {
    const prev = this.map.get(name);
    if (prev) {
      throw new Error(`Binding ${this.prefix}.${name} already registered. Re-register with a same name will result in undefined behaviours.`);
    }
    this.map.set(name, subject);
    this.anyChanges.next([AnyChangeType.ADD_NAME, name, subject.current]);
    this.anyKeyChanges.next();
    const sub = subject.subscribe((value) => this.anyChanges.next([AnyChangeType.UPDATE, name, value]));
    subject._anyDispose = () => sub.unsubscribe();
  };

  @bound
  registerRaw (name: string, value) {
    let valueHolder = value;
    const subject = new BindingSubject(
      () => valueHolder,
      nv => valueHolder = nv,
      true,
    );
    this.register(name, subject);
  };

  @bound
  unregister (name) {
    const subject = this.map.get(name);
    this.anyChanges.next([AnyChangeType.DEL_NAME, name, subject.current]);
    this.anyKeyChanges.next();
    subject._anyDispose?.();
    if (!this.map.delete(name)) {
      console.warn(`Binding ${this.prefix}.${name} was not exists or already deleted. Please report the stack to author.`);
    }
  };

  @bound
  unregisterRaw (name) {
    this.get(name).unsubscribe();
    this.unregister(name);
  };

  @bound
  unregisterAllRaw () {
    let names: string[] = [];
    for (const [name, subject] of this.map.entries()) {
      if (subject.raw) {
        names.push(name);
      }
    }
    names.forEach(raw => this.unregisterRaw(raw));
  };

  @bound
  get (name) {
    return this.map.get(name);
  };

  @bound
  update (name, valueOrFunc) {
    const subject = this.get(name);
    if (subject) {
      let newValue: BindingMap[K];
      if (typeof valueOrFunc === 'function') {
        newValue = valueOrFunc(subject.current);
      } else {
        newValue = valueOrFunc;
      }
      subject.current = newValue;
      subject.next(newValue);
    }
  };

  @bound
  getAll () {
    return [...this.map.entries()].reduce((res, [k, v]) => {
      res[k] = v.current;
      return res;
    }, {});
  };

  @bound
  getAllNames () {
    return [...this.map.keys()];
  };

  @bound
  subscribeAll (cb) {
    const sub = this.anyChanges
      ?.subscribe(([type, name, target]) => {
        cb(type, name, target);
      });

    return () => sub?.unsubscribe();
  };

  @bound
  subscribeAllNames (cb) {
    const sub = this.anyKeyChanges
      ?.subscribe(() => {
        cb([...this.map.keys()]);
      });

    return () => sub?.unsubscribe();
  };

  private static all: Map<string, BindingContext<any>> = new Map();

  public static get<K extends keyof BindingMap> (prefix: K): BindingContext<K> {
    let cur = this.all.get(prefix);
    if (!cur) {
      this.all.set(prefix, cur = new BindingContext<K>(prefix));
    }
    return cur;
  }
}

window.BindingContext = BindingContext;

export function useComponentBindingContext<K extends keyof BindingMap> (prefix: K): ComponentBindingContextValues<K> {
  return BindingContext.get(prefix);
}
