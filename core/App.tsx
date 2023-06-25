'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import { SiteStatus } from '@/components/SiteStatus';
import { InitialWarnings } from '@/core/InitialWarnings';
import AppContext, { AppCurrentUser } from '@/packages/ui/context/app';
import { StoreProvider } from '@/store/provider';
import dynamic from 'next/dynamic';
import React, { ReactNode, use } from 'react';

const SavingIndicator = dynamic(() => import('@/components/pages/Dashboard/SavingIndicator'), { ssr: false });

export default function App ({ currentUser, children }: { currentUser: AppCurrentUser, children: ReactNode }) {
  const defaultAppContext = use(AppContext);

  return (
    <StoreProvider>
      <AppContext.Provider value={{ ...defaultAppContext, currentUser }}>
        <SavingIndicator />
        <ConfirmDialog>
          {children}
          <SiteStatus />
        </ConfirmDialog>

        <InitialWarnings />
      </AppContext.Provider>
    </StoreProvider>
  );
}