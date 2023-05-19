'use client';
import { useEffect } from 'react';
import { singletons } from '@/packages/ui/hooks/bind/context';
import clientOnly from '@/src/utils/clientOnly';
import { Dashboard } from '@/src/types/config';
import { ReactiveDashboardInstance } from '@/src/core/dashboard/reactive-dashboard-instance';
import { dashboards } from '@/app/bind';

function ClientEffect ({ name, dashboard: config }: { name: string, dashboard: Dashboard }) {
  useEffect(() => {
    const canvas = singletons.getOrCreate('dashboard', () => [new ReactiveDashboardInstance('canvas', config)]).current;
    const dashboard = dashboards.getOrCreate(name, () => [new ReactiveDashboardInstance(name, config)]).current;

    canvas.syncWith(dashboard);

    return () => {
      canvas.dispose();
    };
  }, [name]);

  return null;
}

export default clientOnly(ClientEffect);
