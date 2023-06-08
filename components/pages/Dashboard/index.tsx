'use client';

import { DashboardContext } from '@/components/pages/Dashboard/context';
import GridGuide from '@/components/pages/Dashboard/GridGuide';
import { use_unstableBreakpoint, useRowHeight } from '@/components/pages/Dashboard/hooks';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { breakpoints, cols, getFirstBreakpointValue, PersistedLayout } from '@/utils/layout';
import { ItemReference } from '@/utils/types/config';
import { singletons, useCollectionKeys } from '@ossinsight-lite/ui/hooks/bind';
import { useOptionalSingleton, useWhenReady } from '@ossinsight-lite/ui/hooks/bind/hooks';
import { memo, useContext, useMemo, useRef, useState } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { WidgetComponent } from './createWidgetComponent';
import './style.scss';
import { MARGIN, PADDING, ROWS, syncDashboardChanges, syncLayoutChanges } from './utils';

function Dashboard () {
  const { dashboardName, editing } = useContext(DashboardContext);

  const dashboard = useOptionalSingleton('dashboard')?.current;
  const ids = useCollectionKeys(dashboard?.items) as string[];

  const [layouts, setLayouts] = useState<Layouts>({});
  const rowHeight = useRowHeight();
  const ref = useRef<any>();
  const [breakpoint, setBreakpoint] = use_unstableBreakpoint(ref);

  useWhenReady(singletons, 'dashboard', (dashboard, sub) => {
    syncDashboardChanges(dashboardName, dashboard, setLayouts, sub);
  }, []);

  const handleLayoutChange = useRefCallback((currentLayout: Layout[], layouts: Layouts) => {
    setLayouts(layouts);
    const items = dashboard?.items;
    if (editing && items && breakpoint) {
      syncLayoutChanges(items, layouts);
    }
  });

  const handleBreakpointChange = useRefCallback((breakpoint) => {
    console.log('breakpoint change', breakpoint);
    setBreakpoint(breakpoint);
  });

  const children = useMemo(() => {
    function getInitialLayout (item: ItemReference | undefined) {
      if (!breakpoint) {
        return;
      }
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
        />
      </div>
    ));
  }, [ids.join(','), editing, ref.current]);

  return (
    <>
      {editing && <GridGuide rowHeight={rowHeight} breakpoint={breakpoint ?? 'lg'} layout={layouts[breakpoint ?? 'xl'] ?? []} />}
      <ResponsiveGridLayout
        ref={ref}
        className="grid-layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        margin={[MARGIN, MARGIN]}
        containerPadding={[PADDING, PADDING]}
        rowHeight={rowHeight}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        resizeHandles={['se', 'nw']}
        isResizable={editing}
        isDraggable={editing}
        isDroppable={editing}
        maxRows={ROWS}
      >
        {children}
      </ResponsiveGridLayout>
    </>
  );
}

const ResponsiveGridLayout = WidthProvider(Responsive);
const WidgetComponentMeno = memo(WidgetComponent);

export default Dashboard;
