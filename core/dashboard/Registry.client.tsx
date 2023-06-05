'use client';
import { currentDashboard, dashboards, library } from '@/core/bind';
import { ReactiveDashboardInstance } from '@/core/dashboard/reactive-dashboard-instance';
import { singletons } from '@/packages/ui/hooks/bind/context';
import clientOnly from '@/utils/clientOnly';
import { Dashboard, LibraryItem } from '@/utils/types/config';
import { useEffect } from 'react';

function ClientEffect ({ name, dashboard: config, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {
  useEffect(() => {
    let dashboard = dashboards.getNullable(name);
    if (dashboard) {
      dashboard.update(new ReactiveDashboardInstance(name, config));
    } else {
      dashboard = dashboards.add(name, new ReactiveDashboardInstance(name, config));
    }

    let canvas = singletons.getNullable('dashboard');
    if (canvas) {
      // canvas.current.syncWith(dashboard.current)
    } else {
      canvas = singletons.add('dashboard', new ReactiveDashboardInstance('canvas', config));
    }

    currentDashboard.update(dashboard.current);
    library.inactiveScope(() => {

      for (let libraryItem of libraryItems) {
        library.getOrCreate(libraryItem.id ?? libraryItem.name, () => [libraryItem]);
      }
    });

    return () => {
      currentDashboard.update(null);
    };
  }, [name, readonly]);

  return null;
}

export default clientOnly(ClientEffect);
