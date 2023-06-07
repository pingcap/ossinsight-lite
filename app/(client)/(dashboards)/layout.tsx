import DashboardClient from '@/components/pages/Dashboard/dashboard.client';
import dynamic from 'next/dynamic';

import React from 'react';
const SavingIndicator = dynamic(() => import('@/components/pages/Dashboard/SavingIndicator'), { ssr: false });

export default async function DashboardLayout ({ top, children }: any) {
  return (
    <>
      {children}

      <SavingIndicator />

      {/* This is primary component, prevent Layout component remount across navigations */}
      <DashboardClient top={top} />
    </>
  );
}
