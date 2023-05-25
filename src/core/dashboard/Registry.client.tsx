'use client';
import { currentDashboard, dashboards } from '@/app/bind';
import { singletons } from '@/packages/ui/hooks/bind/context';
import { ReactiveDashboardInstance } from '@/src/core/dashboard/reactive-dashboard-instance';
import { Dashboard } from '@/src/types/config';
import clientOnly from '@/src/utils/clientOnly';
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
