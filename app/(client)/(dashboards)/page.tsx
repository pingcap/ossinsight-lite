import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import { TiDBCloudPlaygroundButton } from '@/components/TiDBCloudPlayground';
import { isReadonly } from '@/utils/server/auth';
import React from 'react';

export default async function Page () {
  const readonly = isReadonly();
  return (
    <>
      <TiDBCloudPlaygroundButton />
      <DashboardServer name="default" readonly={readonly} />
    </>
  );
}

export const dynamic = 'force-dynamic';
