'use client';
import clientOnly from '@/src/utils/clientOnly';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { useCollectionKeys, useOptionalCollection, useReactBindCollections } from '@/packages/ui/hooks/bind';
import { useConfig } from '@/src/components/WidgetsManager';

export function useDashboards () {
  const keys = useCollectionKeys(useReactBindCollections());
  const { config } = useConfig();
  const dashboards = useOptionalCollection('dashboards');

  return useMemo(() => {
    const initialConfigKeys = Object.keys(config?.dashboard ?? {});
    const stale = dashboards?.keys as string[] ?? [];

    return [...new Set([...initialConfigKeys, ...stale])].sort();
  }, [config, dashboards, keys]);
}

function List () {
  const dashboards = useDashboards();

  return (
    <>
      {dashboards.map(dashboard => {
        if (dashboard !== 'default') {
          return <li key={dashboard}><Link href={`/dashboards/${encodeURIComponent(dashboard)}`}>{dashboard}</Link></li>;
        } else {
          return <li key={dashboard}><Link href="/">default</Link></li>;
        }
      })}
    </>
  );
}

export default clientOnly(List);
