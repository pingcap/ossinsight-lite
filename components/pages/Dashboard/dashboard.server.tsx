import { getDashboard } from '@/app/(client)/api/layout/operations';
import DashboardRegistry from '@/core/dashboard/Registry';
import { use } from 'react';

export default function DashboardServer ({ name, readonly }: { name: string, readonly: boolean }) {
  const [dashboard, library] = use(getDashboard(name, readonly));

  return (
    <>
      <DashboardRegistry name={name} dashboard={dashboard} library={library} readonly={readonly} />
    </>
  );
}
