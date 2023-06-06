import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import { TiDBCloudPlaygroundButton } from '@/components/TiDBCloudPlayground';
import { isReadonly } from '@/utils/server/auth';
import React from 'react';

export default async function Page ({ params }: any) {
  const readonly = isReadonly();

  return (
    <>
      <TiDBCloudPlaygroundButton />
      <DashboardServer name={params.name} readonly={readonly} />
    </>
  );
}

export const dynamic = 'force-dynamic';
