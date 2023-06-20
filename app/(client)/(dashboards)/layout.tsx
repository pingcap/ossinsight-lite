import ForkMe from '@/components/ForkMe';
import DashboardClient from '@/components/pages/Dashboard/dashboard.client';
import dynamic from 'next/dynamic';

import React from 'react';

export default async function DashboardLayout ({ top, children }: any) {

  return (
    <>
      {children}

      <ForkMe />

      {/* This is primary component, prevent Layout component remount across navigations */}
      <DashboardClient top={top} />
    </>
  );
}
