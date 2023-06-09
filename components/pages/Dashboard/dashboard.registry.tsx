'use client';
import dashboards from '@/store/features/dashboards';
import library from '@/store/features/library';
import { Dashboard, LibraryItem } from '@/utils/types/config';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function DashboardRegistry ({ name, dashboard: dashboardConfig, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(library.actions.load({ library: libraryItems }));
    dispatch(dashboards.actions.load({ dashboards: { [name]: dashboardConfig } }));
  }, [name]);

  return null;
}

export default DashboardRegistry;
