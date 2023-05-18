import { Subject } from 'rxjs';

export interface ReactiveValue<T> extends Subject<T> {
  current: T;
  _debugLastChanged?: string[]
}

export class ReactiveValueSubject<T> extends Subject<T> implements ReactiveValue<T> {
  current: T;
  _readonly: boolean = false;

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
      throw new Error('mutating readonly value');
    }
    super.next(value);
  }
}
