'use client';
import dashboards from '@/store/features/dashboards';
import library from '@/store/features/library';
import clientOnly from '@/utils/clientOnly';
import { Dashboard, LibraryItem } from '@/utils/types/config';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// TODO Fuck it
function ClientEffect ({ name, dashboard, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(library.actions.load({ library: libraryItems }));
    dispatch(dashboards.actions.load({ dashboards: { [name]: dashboard } }));
  }, [name]);

  return null;
}

export default clientOnly(ClientEffect);
