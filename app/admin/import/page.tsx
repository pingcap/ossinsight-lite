import { ImportLayoutForm } from '@/app/admin/import/actions-ui';
import { authenticateGuard } from '@/src/auth';

export default async function Page () {
  await authenticateGuard('/admin/import');

  return (
    <ImportLayoutForm />
  );
}
