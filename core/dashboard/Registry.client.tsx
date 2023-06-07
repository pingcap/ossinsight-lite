'use client';
import { currentDashboard, dashboards, library } from '@/core/bind';
import { ReactiveDashboardInstance } from '@/core/dashboard/reactive-dashboard-instance';
import { singletons } from '@/packages/ui/hooks/bind/context';
import clientOnly from '@/utils/clientOnly';
import { Dashboard, LibraryItem } from '@/utils/types/config';
import { useEffect } from 'react';

// TODO Fuck it
function ClientEffect ({ name, dashboard: config, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {

  useEffect(() => {
    library.inactiveScope(() => {
      for (let libraryItem of libraryItems) {
        library.getOrCreate(libraryItem.id ?? libraryItem.name, () => [libraryItem]);
      }
    });

    let dashboard = dashboards.getNullable(name)?.current;
    if (!dashboard) {
      console.log('create dashboard');
      dashboard = dashboards.add(name, new ReactiveDashboardInstance(name, config)).current;
    }

    let canvas = singletons.getNullable('dashboard');
    if (!canvas) {
      canvas = singletons.add('dashboard', dashboard);
    } else {
      canvas.update(dashboard);
    }
  }, [name, readonly]);

  return null;
}

export default clientOnly(ClientEffect);
