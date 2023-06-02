import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import { TiDBCloudPlaygroundButton } from '@/components/TiDBCloudPlayground';
import React from 'react';

export default async function Page () {
  return (
    <>
      <TiDBCloudPlaygroundButton />
      <DashboardServer name="default" />
    </>
  );
}

export const dynamic = 'force-dynamic';
