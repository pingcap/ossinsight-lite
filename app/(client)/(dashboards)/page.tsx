import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import { isReadonly } from '@/utils/server/auth';
import React from 'react';

export default async function Page () {
  const readonly = isReadonly();
  return (
    <>
      <DashboardServer name="default" readonly={readonly} />
    </>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
