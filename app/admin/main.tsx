'use client';

import { PropsWithChildren, Suspense } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';

export default function Main ({ children }: PropsWithChildren<{}>) {
  const [first] = useSelectedLayoutSegments();
  return (
    <Suspense fallback={<div className='flex-1 h-screen flex items-center justify-center'>Loading data...</div>}>
      {children}
    </Suspense>
  );
}