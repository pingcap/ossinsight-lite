'use client';
import { currentDashboard, dashboards } from '@/core/bind';
import { ReactiveDashboardInstance } from '@/core/dashboard/reactive-dashboard-instance';
import { singletons } from '@/packages/ui/hooks/bind/context';
import clientOnly from '@/utils/clientOnly';
import { Dashboard } from '@/utils/types/config';
import { useEffect } from 'react';

function ClientEffect ({ name, dashboard: config }: { name: string, dashboard: Dashboard }) {
  useEffect(() => {
    singletons.getOrCreate('dashboard', () => [new ReactiveDashboardInstance('canvas', config)]).current;
    const dashboard = dashboards.getOrCreate(name, () => [new ReactiveDashboardInstance(name, config)]).current;
    currentDashboard.update(dashboard);

    return () => {
      currentDashboard.update(null);
    };
  }, [name]);

  return null;
}

export default clientOnly(ClientEffect);
