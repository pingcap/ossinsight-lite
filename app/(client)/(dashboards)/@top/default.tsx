import { getDashboardNames } from '@/app/(client)/api/layout/operations';
import DashboardMenu from '@/components/menu/DashboardMenu';
import { isReadonly } from '@/utils/server/auth';

export default async function Default () {
  const names = await getDashboardNames(isReadonly());

  return <DashboardMenu dashboardNames={names} />;
}
