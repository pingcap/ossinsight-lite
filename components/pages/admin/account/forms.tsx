'use client';
import { deleteReadonlyUser, recreateReadonlyUser, resetPasswordAction } from '@/actions/auth';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';
import { ReactNode } from 'react';

export function ChangePasswordForm () {
  return (
    <section>
      <h2>Reset password</h2>
      <ServerActionForm action={resetPasswordAction}>
        <ActionStateAlerts
          success={{ title: 'Password changed' }}
          pending={{ title: 'Changing password', message: 'Please don\'t leave this page.' }}
        />
        <FormControl name="old-password" label="Old password">
          <Input type="password" />
        </FormControl>
        <FormControl label="New Password" name="password">
          <Input type="password" />
        </FormControl>
        <FormControl label="Repeat Password" name="repeat-password">
          <Input type="password" />
        </FormControl>
        <div className="form-control">
          <Button type="submit">Reset password</Button>
        </div>
      </ServerActionForm>
    </section>
  );
}

export function RecreateReadonlyDatabaseUserForm ({ status }: { status: ReactNode }) {
  return (
    <section className="mt-8">
      <h2>Recreate readonly database user</h2>
      <p className="mb-2">
        Readonly user status: {status}
      </p>
      <ServerActionForm action={recreateReadonlyUser}>
        <ActionStateAlerts
          success={{ title: 'Readonly database user created' }}
          pending={{ title: 'Recreating readonly database user', message: 'Please don\'t leave this page.' }}
        />
        <div className="form-control">
          <Button type="submit">Recreate</Button>
        </div>
      </ServerActionForm>
    </section>
  );
}

export function DeleteReadonlyDatabaseUserForm () {
  return (
    <section className="mt-8">
      <h2>Delete readonly database user</h2>
      <ServerActionForm action={deleteReadonlyUser}>
        <ActionStateAlerts
          success={{ title: 'Readonly database user deleted' }}
          pending={{ title: 'Deleting readonly database user', message: 'Please don\'t leave this page.' }}
        />
        <div className="form-control">
          <Button type="submit">Delete</Button>
        </div>
      </ServerActionForm>
    </section>
  );
}
