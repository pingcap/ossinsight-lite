import DashboardClient from '@/components/pages/Dashboard/dashboard.client';
import React from 'react';

export default async function DashboardLayout ({ children }: any) {
  return (
    <>
      {children}

      {/* This is primary component, prevent Layout component remount across navigations */}
      <DashboardClient />
    </>
  );
}
