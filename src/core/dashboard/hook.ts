import { ReactBindCollection, readItem, useCollectionKeys, useWatchReactiveValue } from '@ossinsight-lite/ui/hooks/bind';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { useEffect, useRef } from 'react';
import { ItemReference } from '@/src/types/config';
import { DashboardInstance } from '@/src/core/dashboard/type';
import { dashboards } from '@/app/bind';

export function useDashboard (name: string) {
  const dashboard = readItem(dashboards, name);

  return useWatchReactiveValue(dashboard);
}
export function useNullableDashboardItems (name: string) {
  const lastValid = useRef<ReactBindCollection<ItemReference>>();
  const dashboard: ReactiveValue<DashboardInstance> | undefined | null = dashboards.getNullable(name);

  useCollectionKeys(dashboards);

  useCollectionKeys(dashboard?.current.items ?? null);
  const result = dashboard?.current.items ?? null;
  useEffect(() => {
    if (result) {
      lastValid.current = result;
    }
  });

  return result;
}
