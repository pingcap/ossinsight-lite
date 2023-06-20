import { ChangePasswordForm } from '@/components/pages/admin/account/forms';

export default async function () {
  return (
    <>
      <ChangePasswordForm />
    </>
  );
}

export const dynamic = 'force-dynamic';
