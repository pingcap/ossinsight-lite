'use client';

import Components from '@ossinsight-lite/layout/src/components/Components';
import GridLayout from '@ossinsight-lite/layout/src/components/GridLayout';
import { memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { equals, Rect } from '@ossinsight-lite/layout/src/core/types';
import { readItem, useCollectionKeys } from '@ossinsight-lite/ui/hooks/bind';
import { WidgetComponent, WidgetStateProps } from './createWidgetComponent';
import { DashboardContext } from './context';
import { useOptionalSingleton, useWatchReactiveValueField } from '@ossinsight-lite/ui/hooks/bind/hooks';
import dynamic from 'next/dynamic';
import { withSuspense } from '@/packages/ui/utils/suspense';

const DashboardMenuItems = dynamic(() => import('./DashboardMenus'), { ssr: false });

function Dashboard ({ dashboardName }: { dashboardName: string }) {
  /// ========
  /// This component have dirty works.
  /// ========
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState<string>();
  const map = useMap<string, string>();

  const dashboard = useOptionalSingleton('dashboard')?.current;
  const items = dashboard?.items;
  const itemIds = useCollectionKeys(items) as string[];

  const useRect = useCallback((id: string) => {
    const last = useRef<Rect>([0, 0, 0, 0]);
    if (!items?.has(id)) {
      // IMPORTANT
      //
      // Mock hook order
      // - readItem(items, id): no hooks, only on context
      // - useReadItem(items, id): useState, useEffect
      useState();
      useEffect(() => {}, [null]);
      return last.current;
    } else {
      const item = readItem(items, id);
      const rect = useWatchReactiveValueField(item, 'rect', equals);
      return last.current = rect;
    }
  }, [items]);

  const updateRect = useCallback((id: string, rect: Rect) => {
    if (items?.has(id)) {
      items.update(id, (props, ctx) => {
        if ((ctx.changed = !equals(props.rect, rect))) {
          ctx.changedKeys = [`rect:${props.rect} => ${rect}`];
          props.rect = rect;
        }
        return props;
      });
    }
  }, [items]);

  const handleDrag = useCallback(async (id: string, rect: Rect) => {
    const externalId = map.get(id);
    if (!externalId) {
      return;
    }
    items?.update(externalId, (props, ctx) => {
      if ((ctx.changed = !equals(props.rect, rect))) {
        ctx.changedKeys = [`rect:${props.rect} => ${rect}`];
        props.rect = rect;
      }
      return props;
    });
  }, [items]);

  return (
    <DashboardContext.Provider value={{ dashboardName }}>
      <Suspense>
        <DashboardMenuItems dashboardName={dashboardName} editMode={editMode} onEditModeUpdate={setEditMode} />
      </Suspense>
      <GridLayout gridSize={[40, 40]} gap={8} className="relative w-screen overflow-x-hidden h-[calc(100vh-40px)]" guideUi={editMode} onDrag={handleDrag}>
        <Components<WidgetStateProps>
          itemIds={itemIds}
          draggable={editMode}
          idMap={map}
          useRect={useRect}
          updateRect={updateRect}
          commonProps={id => ({
            editMode,
            active: active === id,
            wrapperClassName: active === id ? 'active' : undefined,
            onActiveChange: (open) => {
              setActive(active => {
                if (open) {
                  return id;
                } else if (active === id) {
                  return undefined;
                }
              });
            },
          })}
          Component={WidgetComponentMemo}
        />
      </GridLayout>
    </DashboardContext.Provider>
  );
}

export function useMap<K, V> () {
  const [map] = useState(() => new Map<K, V>());
  return map;
}

export default Dashboard;

const isPropsEquals = <T extends Record<string, any>> (ignores: (keyof T)[] = []) => {
  const ignoresSet = new Set(ignores);
  return (a: T, b: T) => {
    const aKeys = Object.keys(a).filter(k => !ignoresSet.has(k));
    const bKeys = Object.keys(b).filter(k => !ignoresSet.has(k));

    if (aKeys.length !== bKeys.length) {
      return false;
    }
    for (let aKey of aKeys) {
      if (a[aKey] !== b[aKey]) {
        return false;
      }
    }
    return true;
  };
};

const WidgetComponentMemo = memo(withSuspense(WidgetComponent, 'Widget Loading...'), isPropsEquals(['onActiveChange']));
