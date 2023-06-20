import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import { isReadonly } from '@/utils/server/auth';
import React from 'react';

export default async function Page ({ params }: any) {
  const readonly = isReadonly();

  return (
    <>
      <DashboardServer name={decodeURIComponent(params.name)} readonly={readonly} />
    </>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
