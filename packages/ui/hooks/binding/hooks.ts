import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BindingMap, useComponentBindingContext } from './context.tsx';
import { Subject } from 'rxjs';
import { BindingValueKeyPath, ExtractBindingValuePath, getPath } from './utils.ts';

export class BindingSubject<T> extends Subject<T> {
  constructor (
    private readonly readRef: () => T,
    private readonly setRef: (value: T) => void,
    public readonly raw: boolean = false,
  ) {
    super();
  }

  get current () {
    return this.readRef();
  }

  set current (nv: T) {
    this.setRef(nv);
  }

  _anyDispose?: () => void;
}

export function useBinding<K extends keyof BindingMap> (prefix: K, name: string, value: BindingMap[K] | (() => BindingMap[K])) {
  const { registerRaw, unregisterRaw, update } = useComponentBindingContext(prefix);
  const initialValue: BindingMap[K] = useMemo(() => {
    if (typeof value === 'function') {
      return (value as any)();
    } else {
      return value;
    }
  }, []);
  const valueRef = useRef(initialValue);

  useEffect(() => {
    registerRaw(name, initialValue);

    return () => {
      unregisterRaw(name);
    };
  }, [name]);

  const setValue = useCallback((valueOrFunc: SetStateAction<BindingMap[K]>) => {
    let newValue: BindingMap[K];
    if (typeof valueOrFunc === 'function') {
      newValue = (valueOrFunc as any)(valueRef.current);
    } else {
      newValue = valueOrFunc;
    }
    valueRef.current = newValue;
    update(name, newValue);
  }, [name]);

  return [valueRef.current, setValue] as const;
}

export function useBindingValue<K extends keyof BindingMap> (prefix: K, name: string) {
  const { get } = useComponentBindingContext(prefix);
  const subject = get(name);
  const [value, setValue] = useState(() => subject?.current);

  useEffect(() => {
    // TODO: subject all keys?
    const sub = subject?.subscribe(value => setValue(value));

    return () => {
      sub?.unsubscribe();
    };
  }, []);

  return value;
}

export function useBindingValuePath<K extends keyof BindingMap, Path extends BindingValueKeyPath<BindingMap[K]>> (prefix: K, name: string, path: Path): ExtractBindingValuePath<BindingMap[K], Path> {
  const { get } = useComponentBindingContext(prefix);
  const subject = get(name);

  useEffect(() => {
    let oldValue = getPath(subject.current, path);
    const sub = subject.subscribe(newRootValue => {
      const newValue = getPath(newRootValue, path);

      if (newValue !== oldValue) {
        setValue(newValue);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const [value, setValue] = useState(() => getPath(subject.current, path));

  return value as any;
}

export function useImmutableBindingValuePath<K extends keyof BindingMap, Path extends BindingValueKeyPath<BindingMap[K]>> (prefix: K, name: string, path: Path): ExtractBindingValuePath<BindingMap[K], Path> {
  const { get } = useComponentBindingContext(prefix);
  return getPath(get(name).current, path);
}

export function useBindingValues<K extends keyof BindingMap> (prefix: K): Record<string, BindingMap[K]> {
  const { getAll, subscribeAll } = useComponentBindingContext(prefix);
  const [values, setValues] = useState(() => getAll());

  useEffect(() => {
    return subscribeAll(() => {
      setValues(getAll());
    });
  }, []);

  return values;
}

export function useBindingNames<K extends keyof BindingMap> (prefix: K): string[] {
  const { getAllNames, subscribeAllNames } = useComponentBindingContext(prefix);
  const [names, setNames] = useState(() => getAllNames());

  useEffect(() => {
    return subscribeAllNames(allNames => {
      setNames(allNames);
    });
  }, []);

  return names;
}
