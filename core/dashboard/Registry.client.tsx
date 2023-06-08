'use client';
import { dashboards } from '@/core/bind';
import { ReactiveDashboardInstance } from '@/core/dashboard/reactive-dashboard-instance';
import { singletons } from '@/packages/ui/hooks/bind/context';
import library, { setSSRLibraryItems } from '@/store/features/library';
import clientOnly from '@/utils/clientOnly';
import { Dashboard, LibraryItem } from '@/utils/types/config';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// TODO Fuck it
function ClientEffect ({ name, dashboard: config, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(library.actions.load({ library: libraryItems }));

    let dashboard = dashboards.getNullable(name)?.current;
    if (!dashboard) {
      console.log('create dashboard');
      dashboard = dashboards.add(name, new ReactiveDashboardInstance(name, config)).current;
    }

    let canvas = singletons.getNullable('dashboard');
    if (!canvas) {
      canvas = singletons.add('dashboard', dashboard);
    } else {
      canvas.update(dashboard);
    }
  }, [name, readonly]);

  if (typeof window !== 'undefined') {
    setSSRLibraryItems(window.__ssrLibraryItems ?? []);
    return null;
  }

  return (
    <Head>
      <Script id="ssr-library-items">{`window.__ssrLibraryItems=${JSON.stringify(libraryItems)}`}</Script>
    </Head>
  );
}

declare global {
  interface Window {
    __ssrLibraryItems: LibraryItem[];
  }
}

export default clientOnly(ClientEffect);
