'use client';

import { coreLoginAction } from '@/actions/auth';
import { ModalContext } from '@/app/@modal/(all)/context';
import LoginForm from '@/components/pages/login/LoginForm';
import authApi from '@/store/features/auth';
import { resolveCurrentGuards } from '@/utils/useAuth';
import { useContext } from 'react';

export default function Page ({ searchParams }: any) {
  const redirectUri = decodeURIComponent(searchParams.redirect_uri) ?? '/';
  const { closeModal, useCompactMode } = useContext(ModalContext);
  const [trigger, state] = authApi.useLazyReloadQuery();

  useCompactMode(true);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <LoginForm
        loginAction={coreLoginAction}
        redirectUri={redirectUri}
        afterLogin={() => {
          resolveCurrentGuards();
          closeModal();
          trigger();
        }}
      />
    </div>
  );
}
