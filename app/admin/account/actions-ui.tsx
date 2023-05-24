'use client';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/src/components/ServerActionForm';
import { resetPasswordAction } from '@/app/admin/account/actions';

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