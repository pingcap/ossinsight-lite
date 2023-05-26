import { serverDashboard } from '@/app/(client)/api/layout/operations.server';
import DashboardRegistry from '@/core/dashboard/Registry';
import { use } from 'react';

export default function DashboardServer ({ name }: { name: string }) {
  const [, dashboard] = use(serverDashboard(name));

  return (
    <>
      <DashboardRegistry name={name} dashboard={dashboard} />
    </>
  );
}
