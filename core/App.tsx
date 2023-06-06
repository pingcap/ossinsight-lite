'use client';

import { appState, withAppStateLoadingState } from '@/core/bind';
import { ReactNode, useEffect } from 'react';

export default function App ({ children }: { children: ReactNode }) {
  useEffect(() => {
    withAppStateLoadingState(fetch('/api/auth').then(res => res.json())
      .then((res) => {
        appState.update({
          ...appState.current,
          authenticated: !!res?.authenticated,
          playground: !!res?.playground,
        });
      }));
  }, []);

  return (
    <>
      {children}
    </>
  );
}