import { singletons } from '@ossinsight-lite/ui/hooks/bind/context';
import ClientEffect from '@/src/core/dashboard/Registry.client';
import { DashboardInstance } from '@/src/core/dashboard/type';
import { ReactiveDashboardInstance } from '@/src/core/dashboard/reactive-dashboard-instance';
import { dashboards } from '@/app/bind';
import { Dashboard } from '@/src/types/config';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface CollectionsBindMap {
    dashboards: DashboardInstance;
  }

  interface SingletonsBindMap {
    dashboard: DashboardInstance;
  }
}

function DashboardRegistry ({ name, dashboard }: { name: string, dashboard: Dashboard }) {
  dashboards.getOrCreate(name, () => [new ReactiveDashboardInstance(name, dashboard)]);
  singletons.getOrCreate('dashboard', () => [new ReactiveDashboardInstance('canvas', dashboard)]);

  return <ClientEffect name={name} dashboard={dashboard} />;
}

export default DashboardRegistry;
