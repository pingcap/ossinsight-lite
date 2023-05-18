import { ReactBindCollection, useCollection, useCollectionKeys, useReactBindCollections, readItem, useWatchReactiveValue } from '@ossinsight-lite/ui/hooks/bind';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { DashboardInstance } from '@/src/core/dashboard/dashboard-instance';
import { useEffect, useRef } from 'react';
import { ItemReference } from '@/src/types/config';

export function useDashboard (name: string) {
  const dashboards = useCollection('dashboards');

  const dashboard = readItem(dashboards, name);

  return useWatchReactiveValue(dashboard);
}

export function useDashboardItems (name: string) {
  const dashboard = useDashboard(name);

  return dashboard.items;
}

export function useNullableDashboardItems (name: string) {
  const lastValid = useRef<ReactBindCollection<ItemReference>>();
  const collections = useReactBindCollections();

  const dashboards = collections.getNullable('dashboards');
  useCollectionKeys(collections);

  const dashboard: ReactiveValue<DashboardInstance> | undefined | null = dashboards?.getNullable(name);

  useCollectionKeys(dashboard?.current.items ?? null);
  const result = dashboard?.current.items ?? null;
  useEffect(() => {
    if (result) {
      lastValid.current = result;
    }
  })

  return result;
}
