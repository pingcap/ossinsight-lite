'use client';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/src/components/ServerActionForm';

const Error: ErrorComponent = ({ error }) => {
  return (
    <div className="bg-red-200 text-red-600 p-2 rounded my-2 w-full">
      <h6 className="font-bold text-lg">{error.name}</h6>
      <p>{error.message}</p>
    </div>
  );
};

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
