'use client';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';

const LoginForm = ({ loginAction, afterLogin, redirectUri }: { loginAction: (form: FormData) => Promise<void>, afterLogin?: () => void, redirectUri: string }) => (
  <ServerActionForm action={loginAction} afterAction={afterLogin}>
    <ActionStateAlerts />
    <input name="username" value="admin" readOnly autoCorrect="no" hidden />
    <input name="redirect_uri" value={redirectUri ?? '/'} readOnly autoCorrect="no" hidden />
    <FormControl name="password">
      <Input type="password" autoCorrect="no" placeholder="password" />
    </FormControl>
    <div className="form-control">
      <Button className="w-full">Login</Button>
    </div>
  </ServerActionForm>
);

export default LoginForm;
