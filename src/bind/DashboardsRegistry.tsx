import { useEffect } from 'react';
import { useReactBindCollections } from '@/packages/ui/hooks/bind';
import { useConfig } from '@/src/components/WidgetsManager';
import clientOnly from '@/src/utils/clientOnly';

function DashboardsRegistry () {
  const collections = useReactBindCollections();

  useEffect(() => {
    const dashboards = collections.add('dashboards');

    return () => {
      collections.del('dashboards');
    };
  }, []);

  return null;
}

export default clientOnly(DashboardsRegistry);
