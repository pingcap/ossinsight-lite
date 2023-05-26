import { dashboards } from '@/core/bind';
import { DashboardInstance } from '@/core/dashboard/type';
import { ReactiveValue } from '@/packages/ui/hooks/bind/ReactiveValueSubject';
import { ItemReference } from '@/utils/types/config';
import { ReactBindCollection, useCollectionKeys } from '@ossinsight-lite/ui/hooks/bind';
import { useEffect, useRef } from 'react';

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
