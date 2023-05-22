import Edit from '@/src/_pages/EditWidgetInstance';
import { authenticateGuard } from '@/src/auth';

export default async function Page ({ params }: any) {
  await authenticateGuard(`/edit/${encodeURIComponent(params.id)}`);

  return <Edit />;
}

export const dynamic = 'force-dynamic';
