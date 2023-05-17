import { useParams } from 'react-router';
import { useConfig } from '../../components/WidgetsManager';
import { useCollection, useReadItem } from '@oss-widgets/ui/hooks/bind';
import { useEffect } from 'react';

export function DashboardAutoSave () {
  const { dashboard: dashboardName = 'default' } = useParams<{ dashboard?: string }>();
  const dashboard = useReadItem(useCollection('dashboards'), dashboardName);
  const { saveConfig } = useConfig();

  useEffect(() => {
    const sub = dashboard.subscribe(() => {
      saveConfig();
    });

    sub.add(dashboard.current.items.subscribeAll(() => {
      saveConfig();
    }));

    return () => {
      sub.unsubscribe();
    };
  }, [dashboardName]);

  return null;
}