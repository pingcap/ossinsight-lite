import DashboardRegistry from '@/src/core/dashboard/Registry';
import React, { use } from 'react';
import { serverDashboard } from '@/app/api/layout/operations.server';

export default function DashboardServer ({ name }: { name: string }) {
  const [, dashboard] = use(serverDashboard(name));

  return (
    <>
      <DashboardRegistry name={name} dashboard={dashboard} />
    </>
  );
}
