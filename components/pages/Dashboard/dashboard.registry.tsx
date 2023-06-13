'use client';
import dashboards, { useInitialLoadDashboards } from '@/store/features/dashboards';
import { useInitialLoadLibraryItems } from '@/store/features/library';
import type { Store } from '@/store/store';
import { Dashboard, LibraryItem } from '@/utils/types/config';
import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';

function DashboardRegistry ({ name, dashboard: dashboardConfig, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {
  const dispatch = useDispatch();

  const store: Store = useStore();

  useInitialLoadLibraryItems(store, libraryItems, true);
  useInitialLoadDashboards(store, { [name]: dashboardConfig });

  useEffect(() => {
    dispatch(dashboards.actions.load({ dashboards: { [name]: dashboardConfig } }));
  }, [name]);

  return null;
}

export default DashboardRegistry;
