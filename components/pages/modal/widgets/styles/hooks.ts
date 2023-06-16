import { nextValue } from '@/packages/ui/hooks/bind/utils';
import { useLibraryItemField, useUpdateLibraryItem } from '@/store/features/library';
import { CSSProperties, SetStateAction, useCallback } from 'react';

type Style = Pick<CSSProperties, 'backgroundColor' | 'justifyContent' | 'alignItems' | 'textAlign'>

export function useStyle<K extends keyof Style, D extends Style[K]> (id: string, prop: K, defaultValue: D) {
  const value = useLibraryItemField(id, ({ props }) => props.style?.[prop]);
  const updateLibraryItem = useUpdateLibraryItem();

  const update = useCallback((payload: SetStateAction<Style[K]>) => {
    updateLibraryItem(id, (item, ctx) => {
      if (item.props.style) {
        const nv = nextValue(item.props.style[prop], payload, void 0);
        if (nv === item.props.style[prop]) {
          ctx.changed = false;
        } else {
          item.props.style[prop] = nv;
          ctx.changedKeys = [`props:style.${prop}`];
        }
      } else {
        item.props.style = { [prop]: nextValue(defaultValue, payload, void 0) };
      }
      return item;
    });
  }, [id, prop]);

  return [value ?? defaultValue, update] as const;
}
