import { ChangePasswordForm } from '@/components/pages/admin/account/forms';
import { authenticateGuard } from '@/utils/server/auth';

export default async function () {
  await authenticateGuard('/admin/account');

  return (
    <ChangePasswordForm />
  );
}

export const dynamic = 'force-dynamic';
