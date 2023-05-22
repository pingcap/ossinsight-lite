'use client';
import { withFormErrorBoundary } from '@/src/utils/form';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';

const Error: ErrorComponent = ({ error }) => {
  return (
    <div className="bg-red-200 text-red-600 p-2 rounded my-2 w-full">
      <h6 className="font-bold text-lg">{error.name}</h6>
      <p>{error.message}</p>
    </div>
  );
};

const LoginForm = withFormErrorBoundary<{ loginAction: (form: FormData) => Promise<void> }>(({ loginAction, errorChildren }) => (
  <>
    {errorChildren}
    <form className="flex flex-col gap-2" action={loginAction}>
      <input name="username" value="admin" readOnly autoCorrect="no" hidden />
      <div>
        <input className="outline-none" name="password" type="password" autoCorrect="no" placeholder="password" />
      </div>
      <div>
        <button className="rounded bg-blue-200 text-blue-900 w-full">Login</button>
      </div>
    </form>
  </>
), Error);

export default LoginForm;
