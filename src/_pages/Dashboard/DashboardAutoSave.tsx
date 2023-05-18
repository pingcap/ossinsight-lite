import { useConfig } from '../../components/WidgetsManager';
import { readItem, useCollection } from '@ossinsight-lite/ui/hooks/bind';
import { useEffect } from 'react';
import { BindingTypeEvent } from '@/packages/ui/hooks/bind/types';
import clientOnly from '@/src/utils/clientOnly';

function AutoSaveDashboard ({ dashboardName }: { dashboardName: string }) {
  const dashboards = useCollection('dashboards');
  const dashboard = readItem(dashboards, dashboardName);
  const { saveConfig } = useConfig();

  useEffect(() => {
    const sub = dashboard.subscribe(() => {
      saveConfig(`dashboard ${dashboardName} changed`);
    });

    // subscribe item changes
    sub.add(dashboard.current.items.events.subscribe(([bind, key, ev]) => {
      saveConfig(`dashboard ${dashboardName} items changed ${String(key)}.${BindingTypeEvent[ev]}[${bind._debugLastChanged}]`);
    }));

    return () => {
      sub.unsubscribe();
    };
  }, [dashboardName]);

  return null;
}

export default clientOnly(AutoSaveDashboard);
