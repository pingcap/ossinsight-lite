'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import { SiteStatus } from '@/components/SiteStatus';
import { InitialWarnings } from '@/core/InitialWarnings';
import { StoreProvider } from '@/store/provider';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const SavingIndicator = dynamic(() => import('@/components/pages/Dashboard/SavingIndicator'), { ssr: false });

export default function App ({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <SavingIndicator />
      <ConfirmDialog>
        {children}
        <SiteStatus />
      </ConfirmDialog>

      <InitialWarnings />
    </StoreProvider>
  );
}