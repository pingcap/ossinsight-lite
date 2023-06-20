'use client';

import { DashboardContext } from '@/components/pages/Dashboard/context';
import DebugInfo from '@/components/pages/Dashboard/DebugInfo';
import GridGuideCanvas from '@/components/pages/Dashboard/GridGuideCanvas';
import { use_unstableBreakpoint, useRowHeight } from '@/components/pages/Dashboard/hooks';
import { SiteFooter } from '@/components/SiteFooter';
import LoadingIndicator from '@/packages/ui/components/loading-indicator';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { withSuspense } from '@/packages/ui/utils/suspense';
import { useDashboardItemIds, useSwitchCurrentDashboard } from '@/store/features/dashboards';
import store from '@/store/store';
import { breakpoints, cols, getFirstBreakpointValue, PersistedLayout } from '@/utils/layout';
import clsx from 'clsx';
import React, { ForwardedRef, memo, useContext, useMemo, useRef, useState } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { WidgetComponent } from './createWidgetComponent';
import './style.scss';
import { computeItemsLayout, computeRows, MARGIN, PADDING, ROWS, syncLayoutChanges } from './utils';

function Dashboard () {
  const { dashboardName, editing } = useContext(DashboardContext);

  const ids = useDashboardItemIds();
  const [layouts, setLayouts] = useState<Layouts>({});
  const rowHeight = useRowHeight();
  const [rows, setRows] = useState(ROWS);
  const ref = useRef<any>();
  const [breakpoint, setBreakpoint] = use_unstableBreakpoint(ref);

  const switchingDashboard = useRef(false);

  useSwitchCurrentDashboard(dashboardName, (name, dashboard) => {
    switchingDashboard.current = true;
    setLayouts(computeItemsLayout(dashboard.items));
  });

  const handleLayoutChange = useRefCallback((currentLayout: Layout[], layouts: Layouts) => {
    setLayouts(layouts);
    setRows(computeRows(currentLayout));
    if (switchingDashboard.current) {
      switchingDashboard.current = false;
    } else if (editing && breakpoint) {
      syncLayoutChanges(layouts);
    }
  });

  const handleBreakpointChange = useRefCallback((breakpoint) => {
    setBreakpoint(breakpoint);
  });

  const children = useMemo(() => {
    function getInitialLayout (id: string) {
      if (!breakpoint) {
        return;
      }
      const { dashboards, current } = store.getState().dashboards;
      const dashboard = dashboards[dashboardName];
      let layout: PersistedLayout | undefined;
      if (dashboard) {
        const item = dashboard.items[id];
        if (item) {
          layout = item.layout[breakpoint];
          if (!layout) {
            layout = getFirstBreakpointValue(item.layout);
          }
        }
      }

      return layout;
    }

    return [...ids].map((id) => (
      <div className="grid-item" ref={ref} key={id} data-grid={getInitialLayout(id)}>
        <WidgetComponentMeno id={id} />
      </div>
    ));
  }, [ids, editing, dashboardName, ref.current]);

  const compact = breakpoint !== 'lg';

  return (
    <div className={clsx('dashboard', { compact })}>
      <GridGuideCanvas rows={rows} cols={cols[breakpoint ?? 'lg']} rowHeight={rowHeight} editing={editing} />
      <ResponsiveGridLayout
        ref={ref}
        className={clsx('grid-layout', { editing, compact })}
        style={{
          minHeight: rows * rowHeight + ((rows - 1) * MARGIN) + PADDING * 2,
        }}
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
        maxRows={compact ? undefined : ROWS}
      >
        {children}
      </ResponsiveGridLayout>
      <DebugInfo />
      <SiteFooter />
    </div>
  );
}

const ResponsiveGridLayout = WidthProvider(Responsive);
const WidgetComponentMeno = memo(withSuspense(WidgetComponent, (ref: ForwardedRef<HTMLDivElement>) => <div className="w-full h-full flex items-center justify-center text-xl text-gray-400 gap-2" ref={ref}><LoadingIndicator /> Loading...</div>));

export default Dashboard;
