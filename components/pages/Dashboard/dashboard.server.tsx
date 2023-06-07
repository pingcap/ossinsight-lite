import { getDashboard } from '@/app/(client)/api/layout/operations';
import { TiDBCloudPlaygroundButton } from '@/components/TiDBCloudPlayground';
import DashboardRegistry from '@/core/dashboard/Registry';
import React, { use } from 'react';

export default function DashboardServer ({ name, readonly }: { name: string, readonly: boolean }) {
  const [dashboard, library] = use(getDashboard(name, readonly));

  return (
    <>
      <TiDBCloudPlaygroundButton />
      <DashboardRegistry name={name} dashboard={dashboard} library={library} readonly={readonly} />
    </>
  );
}
