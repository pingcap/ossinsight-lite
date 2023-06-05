'use client';
import { commands, currentDashboard, dashboards, library } from '@/core/bind';
import { ReactiveDashboardInstance } from '@/core/dashboard/reactive-dashboard-instance';
import { singletons } from '@/packages/ui/hooks/bind/context';
import clientOnly from '@/utils/clientOnly';
import { Dashboard, LibraryItem } from '@/utils/types/config';
import { useEffect, useRef } from 'react';

function ClientEffect ({ name, dashboard: config, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {
  const configLastUpdated = useRef(0);

  useEffect(() => {
    configLastUpdated.current = Date.now();
  }, [libraryItems]);

  useEffect(() => {
    let dashboard = dashboards.getNullable(name)?.current;
    if (dashboard) {
      const theDashboard = dashboard;
      if (configLastUpdated.current > dashboard.items._lastUpdated) {
        commands.inactiveScope(() => {
          const dashboard = theDashboard;
          const existingKeys = new Set(dashboard.items.keys);
          for (let item of config.items) {
            if (dashboard.items.has(item.id)) {
              dashboard.items.update(item.id, item);
            } else {
              dashboard.items.add(item.id, item);
            }
            existingKeys.delete(item.id);
          }
          existingKeys.forEach(key => dashboard.items.del(key));
        });
      }
    } else {
      dashboard = dashboards.add(name, new ReactiveDashboardInstance(name, config)).current;
      configLastUpdated.current = dashboard.items._lastUpdated;
    }

    let canvas = singletons.getNullable('dashboard');
    if (canvas) {
      // canvas.current.syncWith(dashboard.current)
    } else {
      canvas = singletons.add('dashboard', new ReactiveDashboardInstance('canvas', config));
    }

    currentDashboard.update(dashboard);
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
