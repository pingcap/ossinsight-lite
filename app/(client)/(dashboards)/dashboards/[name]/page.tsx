import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import { TiDBCloudPlaygroundButton } from '@/components/TiDBCloudPlayground';
import React from 'react';

export default async function Page ({ params }: any) {
  return (
    <>
      <TiDBCloudPlaygroundButton />
      <DashboardServer name={params.name} />
    </>
  );
}

export const dynamic = 'force-dynamic';
