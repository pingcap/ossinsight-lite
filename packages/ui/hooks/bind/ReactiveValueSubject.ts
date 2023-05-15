import { Subject, Subscribable } from 'rxjs';

export interface ReactiveValue<T> extends Subscribable<T> {
  current: T;
}

export class ReactiveValueSubject<T> extends Subject<T> implements ReactiveValue<T> {
  current: T;
  _readonly: boolean;

  constructor (current: T) {
    super();
    this.current = current;
  }

  markReadonly () {
    this._readonly = true;
  }

  markMutating () {
    this._readonly = false;
  }

  next (value: T) {
    if (this._readonly) {
      throw new Error('mutating readonly value')
    }
    super.next(value);
  }
}
