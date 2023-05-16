import { useParams } from 'react-router';
import { DashboardKey, useConfig } from '../../components/WidgetsManager';
import { useReactBindCollections } from '@oss-widgets/ui/hooks/bind';
import { useEffect } from 'react';
import { ItemReference } from '../../types/config';
import layout from 'widgets:layout';

export function DashboardAutoSave () {
  const { dashboard: dashboardName = 'default' } = useParams<{ dashboard?: string }>();
  const key: DashboardKey = `dashboard.${dashboardName}.items`;
  const collections = useReactBindCollections();
  const { config, saveConfig } = useConfig();

  useEffect(() => {
    const dashboard = collections.add(key);
    dashboard.needLoaded();

    const dashboardConfig: ItemReference[] = config?.dashboard[dashboardName]?.items ?? layout.map(({ id, name, rect }: any) => ({ id: id ?? name, name, rect }));
    dashboardConfig.forEach(item => {
      dashboard.add(item.id, item);
    });
    dashboard.markLoaded();

    const sub = dashboard.subscribeAll(() => {
      saveConfig();
    });

    return () => {
      sub.unsubscribe();

      dashboard.resetLoaded();
      dashboardConfig.forEach(item => {
        dashboard.delIfExists(item.id);
      });
      collections.del(key);
    };
  }, [dashboardName]);

  return null;
}