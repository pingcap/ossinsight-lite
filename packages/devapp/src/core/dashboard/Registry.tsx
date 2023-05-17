import { useConfig } from '../../components/WidgetsManager';
import { useEffect } from 'react';
import { useCollection } from '@oss-widgets/ui/hooks/bind';
import { DashboardInstance } from './dashboard-instance';
import { Dashboard } from '../../types/config';
import { withSuspense } from '@oss-widgets/ui/utils/suspense';

export type DashboardKey = `dashboard.${string};`

declare module '@oss-widgets/ui/hooks/bind' {
  interface BindMap {
    dashboards: DashboardInstance;
  }
}

export const DashboardRegistry = withSuspense(function ({ name, defaultDashboard }: { name: string, defaultDashboard: () => Dashboard }) {
  const dashboards = useCollection('dashboards');
  const { config } = useConfig();

  useEffect(() => {
    let dashboardConfig = config.dashboard[name];
    if (!dashboardConfig) {
      dashboardConfig = defaultDashboard();
    }
    dashboards.add(name, new DashboardInstance(dashboardConfig));

    return () => {
      dashboards.del(name);
    };
  }, [config, name]);

  return null;
});
