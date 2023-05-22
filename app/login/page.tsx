import { authenticate } from '@/src/auth';
import { cookies, headers } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { isDev } from '@/packages/ui/utils/dev';
import { redirect } from 'next/navigation';
import LoginForm from '@/app/login/form';

export default function Page ({ searchParams }: any) {
  const redirectUri = searchParams.redirect_uri ?? '/';

  async function loginAction (form: FormData) {
    'use server';
    const username = form.get('username') || 'admin';
    const password = form.get('password');

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('Bad credential');
    }

    if (!await authenticate(username, password)) {
      throw new Error('Bad credential');
    }

    const auth = `${Buffer.from(username).toString('base64url')}:${Buffer.from(password).toString('base64url')}`;

    cookies().set({
      name: 'auth',
      value: auth,
      path: '/',
      secure: !isDev,
      sameSite: 'strict',
    } as ResponseCookie);

    const origin = headers().get('Origin');
    redirect(origin + redirectUri);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="p-2 bg-white flex flex-col items-center">
        <h2 className="mb-2 text-lg">Login to continue</h2>
        <LoginForm loginAction={loginAction} />
      </div>
    </div>
  );
}
