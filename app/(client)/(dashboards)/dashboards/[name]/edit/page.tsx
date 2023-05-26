import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import { authenticateGuard } from '@/utils/server/auth';

export default async function Page ({ params }: any) {
  await authenticateGuard(`/dashboards/${encodeURIComponent(params.name)}/edit`);
  return <DashboardServer name={params.name} />;
}

export const dynamic = 'force-dynamic';
