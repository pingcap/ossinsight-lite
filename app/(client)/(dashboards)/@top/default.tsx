import { getDashboardNames } from '@/app/(client)/api/layout/operations';
import { SiteHeader } from '@/components/SiteHeader';
import { isReadonly } from '@/utils/server/auth';
import React from 'react';

export default async function Default () {
  const names = await getDashboardNames(isReadonly());

  return <SiteHeader contentGroup='dashboard' dashboardNames={names} />;
}
