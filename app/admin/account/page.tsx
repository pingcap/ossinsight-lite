import { ChangePasswordForm } from '@/app/admin/account/actions-ui';
import { authenticateGuard } from '@/src/auth';

export default async function () {
  await authenticateGuard('/admin/account');

  return (
    <ChangePasswordForm />
  );
}
