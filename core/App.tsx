'use client';

import { StoreProvider } from '@/store/provider';
import { ReactNode, useEffect } from 'react';

export default function App ({ children }: { children: ReactNode }) {
  useEffect(() => {
  }, []);

  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
}