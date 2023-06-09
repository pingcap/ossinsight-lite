import { getDashboardNames } from '@/app/(client)/api/layout/operations';
import DashboardMenu from '@/components/menu/DashboardMenu';
import { isReadonly } from '@/utils/server/auth';

export default async function Default () {
  const readonly = isReadonly();
  const names = await getDashboardNames(isReadonly());

  return <DashboardMenu dashboardNames={names} readonly={readonly} />;
}
