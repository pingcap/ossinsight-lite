'use client';

import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { BreakpointName, breakpoints, cols, compareLayoutShape, getFirstBreakpointValue, PersistedLayout } from '@/utils/layout';
import { ItemReference } from '@/utils/types/config';
import { BindingTypeEvent, singletons, useCollectionKeys } from '@ossinsight-lite/ui/hooks/bind';
import { useOptionalSingleton, useWhenReady } from '@ossinsight-lite/ui/hooks/bind/hooks';
import { memo, useMemo, useRef, useState } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { DashboardContext } from './context';
import { WidgetComponent } from './createWidgetComponent';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard ({ dashboardName, editMode }: { dashboardName: string, editMode: boolean }) {
  const dashboard = useOptionalSingleton('dashboard')?.current;
  const ids = useCollectionKeys(dashboard?.items) as string[];

  const [layouts, setLayouts] = useState<Layouts>({});
  const [breakpoint, setBreakpoint] = useState<BreakpointName>('xl');
  const ref = useRef<any>();

  useWhenReady(singletons, 'dashboard', (dashboard, sub) => {
    setLayouts(dashboard.current.computeLayout());
    // subscribe dashboard changes and update layouts
    sub.add(dashboard.current.items.subscribeAll(([item, key, ev]) => {
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
  }, [dashboardName]);

  const handleLayoutChange = useRefCallback((currentLayout: Layout[], layouts: Layouts) => {
    setLayouts(layouts);
    console.log('layout changes', breakpoint, currentLayout);
    const items = dashboard?.items;
    if (editMode && items) {
      if (breakpoint) {
        const layout = layouts[breakpoint];
        for (let shape of layout) {
          items.update(shape.i, (item, ctx) => {
            const prev = item.layout[breakpoint];
            if (prev) {
              if (compareLayoutShape(prev, shape)) {
                ctx.changed = false;
                return item;
              }
            }
            ctx.changedKeys = [`layout`];
            const { x, y, w, h } = shape;
            item.layout = {
              ...item.layout,
              [breakpoint]: { ...prev, x, y, w, h },
            };
            return item;
          });
        }
      }
    }
  });

  const handleBreakpointChange = useRefCallback((breakpoint) => {
    console.log('breakpoint change', breakpoint);
    setBreakpoint(breakpoint);
  });

  const children = useMemo(() => {
    // Super stupid codes
    let breakpoint: BreakpointName;
    try {
      // @ts-ignore
      breakpoint = ref.current?._reactInternals.child.stateNode.state.breakpoint;
    } catch (e) {
    }

    function getInitialLayout (item: ItemReference | undefined) {
      let layout: PersistedLayout | undefined;
      if (item) {
        layout = item.layout[breakpoint];
        if (!layout) {
          layout = getFirstBreakpointValue(item.layout);
        }
      }
      return layout;
    }

    return ids.map(id => (
      <div key={id} data-grid={getInitialLayout(dashboard?.items.getNullable(id)?.current)}>
        <WidgetComponentMeno
          id={id}
          editMode={editMode}
        />
      </div>
    ));
  }, [ids.join(','), editMode, ref.current]);

  console.log(breakpoint, layouts, ids);

  return (
    <DashboardContext.Provider value={{ dashboardName }}>
      <ResponsiveGridLayout
        ref={ref}
        className="relative w-screen h-min-screen overflow-x-hidden"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        margin={[8, 8]}
        containerPadding={[32, 32]}
        rowHeight={46}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        isResizable={editMode}
        isDraggable={editMode}
        isDroppable={editMode}
      >
        {children}
      </ResponsiveGridLayout>
    </DashboardContext.Provider>
  );
}

const WidgetComponentMeno = memo(WidgetComponent);

export default Dashboard;
