import DashboardServer from '@/components/pages/Dashboard/dashboard.server';

export default async function Page ({ params }: any) {
  return <DashboardServer name={params.name} readonly={false} />;
}

export const dynamic = 'force-dynamic';
