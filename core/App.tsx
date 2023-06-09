'use client';

import { StoreProvider } from '@/store/provider';
import { ReactNode } from 'react';

export default function App ({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
}