import { ChangePasswordForm, DeleteReadonlyDatabaseUserForm, RecreateReadonlyDatabaseUserForm } from '@/components/pages/admin/account/forms';
import ReadonlyUserStatus from '@/components/pages/admin/account/ReadonlyUserStatus';
import LoadingIndicator from '@/packages/ui/components/loading-indicator/Icon';
import { Suspense } from 'react';

export default async function () {
  return (
    <>
      <ChangePasswordForm />
      <RecreateReadonlyDatabaseUserForm
        status={
          <Suspense fallback={<LoadingIndicator className="inline-block" />}>
            <ReadonlyUserStatus />
          </Suspense>
        }
      />
      <DeleteReadonlyDatabaseUserForm />
    </>
  );
}

export const dynamic = 'force-dynamic';
