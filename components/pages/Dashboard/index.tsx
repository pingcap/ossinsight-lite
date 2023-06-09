'use client';

import { DashboardContext } from '@/components/pages/Dashboard/context';
import DebugInfo from '@/components/pages/Dashboard/DebugInfo';
import GridGuide from '@/components/pages/Dashboard/GridGuide';
import { use_unstableBreakpoint, useRowHeight } from '@/components/pages/Dashboard/hooks';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useDashboardItemIds, useSwitchCurrentDashboard } from '@/store/features/dashboards';
import store from '@/store/store';
import { breakpoints, cols, getFirstBreakpointValue, PersistedLayout } from '@/utils/layout';
import { memo, useContext, useMemo, useRef, useState } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { WidgetComponent } from './createWidgetComponent';
import './style.scss';
import { computeItemsLayout, MARGIN, PADDING, ROWS, syncLayoutChanges } from './utils';

function Dashboard () {
  const { dashboardName, editing } = useContext(DashboardContext);

  const ids = useDashboardItemIds();
  const [layouts, setLayouts] = useState<Layouts>({});
  const rowHeight = useRowHeight();
  const ref = useRef<any>();
  const [breakpoint, setBreakpoint] = use_unstableBreakpoint(ref);

  const switchingDashboard = useRef(false);

  useSwitchCurrentDashboard(dashboardName, (name, dashboard) => {
    switchingDashboard.current = true;
    setLayouts(computeItemsLayout(dashboard.items));
  });

  const handleLayoutChange = useRefCallback((currentLayout: Layout[], layouts: Layouts) => {
    setLayouts(layouts);
    if (switchingDashboard.current) {
      switchingDashboard.current = false;
    } else if (editing && breakpoint) {
      syncLayoutChanges(layouts);
    }
  });

  const handleBreakpointChange = useRefCallback((breakpoint) => {
    console.log('breakpoint change', breakpoint);
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
      <div ref={ref} key={id} data-grid={getInitialLayout(id)}>
        <WidgetComponentMeno id={id} />
      </div>
    ));
  }, [ids, editing, dashboardName, ref.current]);

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
      <DebugInfo />
    </>
  );
}

const ResponsiveGridLayout = WidthProvider(Responsive);
const WidgetComponentMeno = memo(WidgetComponent);

export default Dashboard;
