'use client';

import { appState, withAppStateLoadingState } from '@/core/bind';
import { reloadAuth } from '@/core/bind-client';
import { ReactNode, useEffect } from 'react';

export default function App ({ children }: { children: ReactNode }) {
  useEffect(() => {
    reloadAuth();
  }, []);

  return (
    <>
      {children}
    </>
  );
}