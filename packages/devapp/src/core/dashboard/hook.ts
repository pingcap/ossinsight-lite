import { useCollection, useCollectionValues, useReadItem, useWatchReactiveValue } from '@oss-widgets/ui/hooks/bind';

export function useDashboard (name: string) {
  const dashboards = useCollection('dashboards');

  const dashboard = useReadItem(dashboards, name);

  return useWatchReactiveValue(dashboard);
}

export function useDashboardItems (name: string) {
  const dashboard = useDashboard(name);

  return dashboard.items;
}
