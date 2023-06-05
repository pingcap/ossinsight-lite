import { library } from '@/core/bind';
import { readItem, useWatchReactiveValue } from '@/packages/ui/hooks/bind';
import { ReactiveValueSubject } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { nextValue } from '@/packages/ui/hooks/bind/utils';
import { CSSProperties, SetStateAction, useCallback, useEffect, useMemo } from 'react';

type Style = Pick<CSSProperties, 'backgroundColor' | 'justifyContent' | 'alignItems' | 'textAlign'>

export function useStyle<K extends keyof Style> (id: string, prop: K, defaultValue: Style[K]) {
  const item = readItem(library, id);

  const value = useMemo(() => {
    return new ReactiveValueSubject<Style[K]>(item.current.props.style?.[prop] ?? defaultValue);
  }, [id, prop]);

  useEffect(() => {
    let pulling = false;
    let pushing = false;

    const sub = item.subscribe(next => {
      if (pushing) {
        return;
      }
      pulling = true;
      const newValue = next.props.style?.[prop];
      // @ts-ignore TS2590: too complex
      if (newValue !== value.current) {
        value.current = newValue;
        value.notify();
      }
      pulling = false;
    });

    sub.add(value.subscribe(next => {
      if (pulling) {
        return;
      }
      pushing = true;
      if (item.current.props.style?.[prop] !== next) {
        library.update(id, (item, changed) => {
          item.props = {
            ...item.props,
            style: {
              ...item.props.style,
              [prop]: next,
            },
          };

          changed.changedKeys = [`props:style.${prop}`];
          return item;
        });
      }
      pushing = false;
    }));

    return () => sub.unsubscribe();
  }, [id, prop]);

  const update = useCallback((payload: SetStateAction<Style[K]>) => {
    value.update(nextValue(value.current, payload, void 0) || defaultValue);
  }, [value]);

  const currentValue = useWatchReactiveValue(value);

  return [currentValue, update] as const;
}
