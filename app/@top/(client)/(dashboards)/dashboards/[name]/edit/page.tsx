import { getDashboardNames } from '@/app/(client)/api/layout/operations';
import DashboardMenu from '@/components/menu/DashboardMenu';
import { isReadonly } from '@/utils/server/auth';

export default async function Page ({ params }: any) {
  const name = decodeURIComponent(params.name);
  const names = await getDashboardNames(isReadonly());

  return <DashboardMenu dashboardNames={names} dashboardName={name} editMode={true} />;
}