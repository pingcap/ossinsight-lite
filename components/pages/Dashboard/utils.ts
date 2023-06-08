import { DashboardInstance } from '@/core/dashboard/type';
import { BindingTypeEvent, ReactBindCollection } from '@/packages/ui/hooks/bind';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { compareLayoutShape, eachBreakpointCompare, extractLayoutItem } from '@/utils/layout';
import { ItemReference } from '@/utils/types/config';
import { Dispatch, SetStateAction } from 'react';
import { Layouts } from 'react-grid-layout';
import { Subscription } from 'rxjs';

export function syncLayoutChanges (items: ReactBindCollection<ItemReference>, layouts: Layouts) {
  for (let id of items.keys) {
    const layout = extractLayoutItem(layouts, id as string);
    items.update(id, (item, ctx) => {
      if (eachBreakpointCompare(item.layout, layout, compareLayoutShape)) {
        ctx.changed = false;
      } else {
        ctx.changedKeys = ['layout'];
        item.layout = layout;
      }
      return item;
    });
  }
}

export function syncDashboardChanges (dashboardName: string, dashboard: ReactiveValue<DashboardInstance>, setLayouts: Dispatch<SetStateAction<Layouts>>, sub: Subscription) {
  function switchToDashboard (dashboard: DashboardInstance) {
    setLayouts(dashboard.computeLayout());
    // subscribe dashboard changes and update layouts
    sub.add(dashboard.items.subscribeAll(([item, key, ev]) => {
      switch (ev) {
        case BindingTypeEvent.CREATED:
          setLayouts(layouts => {
            Object.entries(item.layout).forEach(([breakpoint, layout]) => {
              layouts[breakpoint] ??= [];
              layouts[breakpoint].push({
                i: key as string,
                ...layout,
              });
            });
            return { ...layouts };
          });
          break;
        case BindingTypeEvent.DELETED:
          setLayouts(layouts => {
            Object.values(layouts).forEach(items => {
              const index = items.findIndex(item => item.i === key);
              if (index !== -1) {
                items.splice(index, 1);
              }
            });
            return { ...layouts };
          });
          break;
        case BindingTypeEvent.UPDATED:
          setLayouts(layouts => {
            Object.entries(item.layout).forEach(([breakpoint, layout]) => {
              const items = layouts[breakpoint] ??= [];
              const index = items.findIndex(item => item.i === key);
              if (index !== -1) {
                Object.assign(items[index], layout);
              }
            });
            return { ...layouts };
          });
          break;
      }
    }));

    console.log('listening', dashboardName);
    sub.add(() => console.log('stop listening', dashboardName));
  }

  switchToDashboard(dashboard.current);

  sub.add(dashboard.subscribe(switchToDashboard));
}

export const DEFAULT_ROW_HEIGHT = 46;
export const MIN_ROW_HEIGHT = 46; // 768px
export const MAX_ROW_HEIGHT = 154; // 2190px
export const ROWS = 13;
export const MARGIN = 8;
export const PADDING = 32;

export const computeRowHeight = (containerHeight: number) => {
  const expectedHeight = (containerHeight - PADDING * 2 - MARGIN * (ROWS - 1)) / ROWS;
  return Math.min(MAX_ROW_HEIGHT, Math.max(MIN_ROW_HEIGHT, expectedHeight));
};
