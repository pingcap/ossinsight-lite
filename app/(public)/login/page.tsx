import { loginAction } from '@/actions/auth';
import LoginForm from '@/components/pages/login/LoginForm';

export default function Page ({ searchParams }: any) {
  const redirectUri = decodeURIComponent(searchParams.redirect_uri ?? '/');

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="p-2 bg-white flex flex-col items-center">
        <LoginForm loginAction={loginAction} redirectUri={redirectUri} />
      </div>
    </div>
  );
}
