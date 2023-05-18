'use client';
import { useConfig } from '../../components/WidgetsManager';
import { useEffect } from 'react';
import { useCollection, whenReady } from '@oss-widgets/ui/hooks/bind';
import { DashboardInstance } from './dashboard-instance';
import { Dashboard } from '../../types/config';
import clientOnly from '@/src/utils/clientOnly';
import { useReactBindSingletons } from '@/packages/ui/hooks/bind/context';

declare module '@oss-widgets/ui/hooks/bind' {
  interface CollectionsBindMap {
    dashboards: DashboardInstance;
  }

  interface SingletonsBindMap {
    dashboard: DashboardInstance;
  }
}

function DashboardRegistry ({ name, defaultDashboard }: { name: string, defaultDashboard: () => Dashboard }) {
  const singletons = useReactBindSingletons();
  const dashboards = useCollection('dashboards');
  const { config } = useConfig();

  let dashboardConfig = config.dashboard[name];
  if (!dashboardConfig) {
    dashboardConfig = defaultDashboard();
  }

  if (!dashboards.has(name)) {
    setTimeout(() => {
      dashboards.add(name, new DashboardInstance(name, dashboardConfig));
    }, 0);
  }

  if (!singletons.has('dashboard')) {
    setTimeout(() => {
      singletons.add('dashboard', new DashboardInstance('canvas', defaultDashboard()));
    }, 0);
  }

  useEffect(() => {
    const sub = whenReady(singletons, 'dashboard', ({ current: dashboard }) => {
      dashboard.dispose();
      dashboard.addDisposeDependency(whenReady(dashboards, name, (bind) => {
        dashboard.syncWith(bind.current);
      }));
    });

    return () => {
      // console.log('del', name)
      // dashboards.del(name);
      sub?.unsubscribe();
    };
  }, [name]);

  return null;
}

export default clientOnly(DashboardRegistry);
