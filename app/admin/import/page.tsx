import { ImportLayoutForm } from '@/components/pages/admin/import/forms';
import { authenticateGuard } from '@/utils/server/auth';

export default async function Page () {
  await authenticateGuard('/admin/import');

  return (
    <ImportLayoutForm />
  );
}

export const dynamic = 'force-dynamic';
