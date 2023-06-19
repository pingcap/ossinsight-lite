'use client';
import { ActionStateAlerts, Button, FormControl, Input, ServerActionForm } from '@/components/ServerActionForm';
import ArrowRightIcon from 'bootstrap-icons/icons/arrow-right.svg';

const LoginForm = ({ loginAction, afterLogin, redirectUri }: { loginAction: (form: FormData) => Promise<void>, afterLogin?: () => void, redirectUri: string }) => (
  <ServerActionForm className="py-6 px-16" action={loginAction} afterAction={afterLogin}>
    <h2 className="mb-2 text-primary text-center font-bold text-sm">Login to edit dashboards</h2>
    <ActionStateAlerts />
    <input name="username" value="admin" readOnly autoCorrect="no" hidden />
    <input name="redirect_uri" value={redirectUri ?? '/'} readOnly autoCorrect="no" hidden />
    <FormControl name="password">
      <Input className="w-full" type="password" autoCorrect="no" placeholder="password" />
    </FormControl>
    <div className="form-control">
      <Button className="w-full">Login</Button>
    </div>
    <div className="mt-8 text-xs flex items-center gap-2">
      <span>Not the owner?</span>
      <a href="https://github.com/pingcap/ossinsight-lite/#how-to-deploy-your-own-10mins" target="_blank" className="inline-flex items-center gap-1 text-yellow-600">
        Get your own dashboard
        <ArrowRightIcon width={12} height={12} />
      </a>
    </div>
  </ServerActionForm>
);

export default LoginForm;
