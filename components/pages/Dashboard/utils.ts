import dashboardsFeature from '@/store/features/dashboards';
import store, { State } from '@/store/store';
import { breakpointNames, compareLayoutShape, eachBreakpointCompare, extractLayoutItem, ItemReferenceLayout } from '@/utils/layout';
import { ItemReference } from '@/utils/types/config';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Layout, Layouts } from 'react-grid-layout';
import { useSelector } from 'react-redux';

export function syncLayoutChanges (layouts: Layouts) {
  const { dashboards: { dashboards, current } } = store.getState();
  if (!current) {
    return;
  }
  const dashboard = dashboards[current];
  if (!dashboard) {
    return;
  }
  for (let id of Object.keys(dashboard.items)) {
    const layout = extractLayoutItem(layouts, id);
    store.dispatch(dashboardsFeature.actions.update({
      id,
      item: (item, ctx) => {
        if (eachBreakpointCompare(item.layout, layout, compareLayoutShape)) {
          ctx.changed = false;
        } else {
          ctx.changedKeys = ['layout'];
          item.layout = layout;
        }
        return item;
      },
    }));
  }
}

export function computeItemsLayout (items: Record<string, ItemReference>) {
  const itemsArray = Object.values(items);
  return breakpointNames.reduce((layouts, breakpoint) => {
    const layout = itemsArray.flatMap(item => {
      const layout = item.layout[breakpoint];
      if (layout) {
        return [{
          ...layout,
          i: item.id,
        }];
      } else {
        return [];
      }
    });
    if (layout.length === itemsArray.length) {
      layouts[breakpoint] = layout;
    }
    return layouts;
  }, {} as Layouts);
}

export function useSyncItemLayoutChange (id: string, setLayouts: Dispatch<SetStateAction<Layouts>>) {
  const initialized = useRef(false);
  const layout = useSelector<State, ItemReferenceLayout | undefined>(({ dashboards: { dashboards, current } }) => {
    if (!current) {
      return undefined;
    }
    return dashboards[current].items[id].layout;
  });

  useEffect(() => {
    if (!layout) {
      return;
    }
    if (!initialized.current) {
      setLayouts(layouts => {
        Object.entries(layout).forEach(([breakpoint, layout]) => {
          const items = Array.from(layouts[breakpoint] ??= []);
          const index = items.findIndex(item => item.i === id);
          if (index !== -1) {
            items[index] = Object.assign({}, items[index], layout);
          }
        });
        return { ...layouts };
      });
    }
  }, [id, layout]);

  useEffect(() => {
    if (!layout) {
      return;
    }
    setLayouts(layouts => {
      Object.entries(layout).forEach(([breakpoint, layout]) => {
        layouts[breakpoint] ??= [];
        layouts[breakpoint].push({
          i: id,
          ...layout,
        });
      });
      return { ...layouts };
    });
    initialized.current = true;
  }, [id]);
}

export const DEFAULT_ROW_HEIGHT = 46;
export const MIN_ROW_HEIGHT = 46; // 768px
export const MAX_ROW_HEIGHT = 154; // 2190px
export const ROWS = 13;
export const MARGIN = 8;
export const PADDING = 8;

export const computeRowHeight = (containerHeight: number) => {
  const expectedHeight = (containerHeight - PADDING * 2 - MARGIN * (ROWS - 1)) / ROWS;
  return Math.min(MAX_ROW_HEIGHT, Math.max(MIN_ROW_HEIGHT, expectedHeight));
};

export function computeRows (layouts: Layout[]) {
  return layouts.reduce((rows, l) => (Math.max(rows, l.y + l.h)), ROWS);
}
