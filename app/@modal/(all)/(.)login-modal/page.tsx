'use client';

import { coreLoginAction } from '@/actions/auth';
import { ModalContext } from '@/app/@modal/(all)/context';
import LoginForm from '@/components/pages/login/LoginForm';
import { appState } from '@/core/bind';
import { reloadAuth } from '@/core/bind-client';
import { resolveCurrentGuards } from '@/utils/useAuth';
import { useContext } from 'react';

export default function Page ({ searchParams }: any) {
  const redirectUri = decodeURIComponent(searchParams.redirect_uri) ?? '/';
  const { closeModal } = useContext(ModalContext);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="mb-2 text-lg">Login to continue</h2>
      <LoginForm
        loginAction={coreLoginAction}
        redirectUri={redirectUri}
        afterLogin={() => {
          resolveCurrentGuards();
          closeModal();
          appState.update({
            ...appState.current,
            authenticated: true,
          });
          void reloadAuth();
        }}
      />
    </div>
  );
}
