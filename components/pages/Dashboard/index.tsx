'use client';

import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useCollectionKeys } from '@ossinsight-lite/ui/hooks/bind';
import { useOptionalSingleton } from '@ossinsight-lite/ui/hooks/bind/hooks';
import { useEffect, useRef, useState } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { DashboardContext } from './context';
import { WidgetComponent } from './createWidgetComponent';

const defaultWidth = typeof window === 'undefined' ? 1920 : window.innerWidth;

const ResponsiveGridLayout = WidthProvider(Responsive);

const breakpointNames = ['xl', 'lg', 'md', 'sm', 'xs', 'xxs'];
const breakpoints = { xl: 1600, lg: 1200, md: 960, sm: 768, xs: 480, xxs: 0 };
const cols = { xl: 40, lg: 32, md: 24, sm: 16, xs: 12, xxs: 8 };

function Dashboard ({ dashboardName, editMode }: { dashboardName: string, editMode: boolean }) {
  const dashboard = useOptionalSingleton('dashboard')?.current;
  const items = dashboard?.items;
  const ids = useCollectionKeys(items) as string[];

  const [layouts, setLayouts] = useState<Layouts>({});
  const breakpointRef = useRef<string>();

  useEffect(() => {
    if (items) {
      const layouts = breakpointNames.reduce((layouts, breakpoint) => {
        const layout = items.values.flatMap(item => {
          if (item.layout[breakpoint]) {
            return [{
              ...item.layout[breakpoint],
              i: item.id,
            }];
          } else {
            return [];
          }
        });
        if (layout.length === items.keys.length) {
          layouts[breakpoint] = layout;
        }
        return layouts;
      }, {} as Layouts);
      setLayouts(layouts);
    }
  }, [dashboard, editMode]);

  const handleLayoutChange = useRefCallback((currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
    if (items) {
      const breakpoint = breakpointRef.current ?? breakpointNames.find(name => !!allLayouts[name]);
      if (breakpoint) {
        const layout = allLayouts[breakpoint];
        for (let { i, x, y, w, h } of layout) {
          items.update(i, (item, ctx) => {
            const prev = item.layout[breakpoint];
            if (prev) {
              if (prev.x === x && prev.y === y && prev.w === w && prev.h === h) {
                ctx.changed = false;
                return item;
              }
            }
            ctx.changedKeys = [`layout`];
            return {
              ...item,
              layout: {
                ...item.layout,
                [breakpoint]: { ...prev, x, y, w, h },
              },
            };
          });
        }
      }
    }
  });

  const handleBreakpointChange = useRefCallback((breakpoint) => {
    breakpointRef.current = breakpoint;
  });

  return (
    <DashboardContext.Provider value={{ dashboardName }}>
      <ResponsiveGridLayout
        className="relative w-screen h-min-screen overflow-x-hidden"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        margin={[8, 8]}
        containerPadding={[32, 32]}
        rowHeight={46}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
      >
        {ids.map(id => (
          <div key={id}>
            <WidgetComponent
              id={id}
              editMode={editMode}
              dashboardName={dashboardName}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </DashboardContext.Provider>
  );
}

export default Dashboard;
