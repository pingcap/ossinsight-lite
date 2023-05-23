'use client';
import { ActionError, ActionPending, ActionSucceed, Button, FormControl, Input, ServerActionForm } from '@/src/components/ServerActionForm';
import { resetPasswordAction } from '@/app/admin/account/actions';
import { Alert } from '@/src/components/Alert';

export function ChangePasswordForm () {
  return (
    <section>
      <h2>Reset password</h2>
      <ServerActionForm action={resetPasswordAction}>
        <ActionError />
        <ActionSucceed>
          <Alert type="success" title="Password changed." />
        </ActionSucceed>
        <ActionPending>
          <Alert type="warning" title="Changing password." message="Please do not leave this page." />
        </ActionPending>
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