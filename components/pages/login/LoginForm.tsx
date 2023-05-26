'use client';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';

const LoginForm = ({ loginAction }: { loginAction: (form: FormData) => Promise<void> }) => (
  <ServerActionForm action={loginAction}>
    <ActionStateAlerts />
    <input name="username" value="admin" readOnly autoCorrect="no" hidden />
    <FormControl name="password">
      <Input type="password" autoCorrect="no" placeholder="password" />
    </FormControl>
    <div className="form-control">
      <Button className="w-full">Login</Button>
    </div>
  </ServerActionForm>
);

export default LoginForm;
