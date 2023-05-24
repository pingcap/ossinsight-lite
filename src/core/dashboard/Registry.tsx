import { dashboards } from '@/app/bind';
import { ReactiveDashboardInstance } from '@/src/core/dashboard/reactive-dashboard-instance';
import ClientEffect from '@/src/core/dashboard/Registry.client';
import { DashboardInstance } from '@/src/core/dashboard/type';
import { Dashboard, LibraryItem } from '@/src/types/config';
import { singletons } from '@ossinsight-lite/ui/hooks/bind/context';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface CollectionsBindMap {
    dashboards: DashboardInstance;
    library: LibraryItem;
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
