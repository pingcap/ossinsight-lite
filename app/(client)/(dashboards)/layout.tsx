import React from 'react';
import DashboardClient from '@/app/(client)/(dashboards)/dashboard.client';

export default async function DashboardLayout ({ children }: any) {
  return (
    <>
      {children}

      {/* This is primary component, prevent Layout component remount across navigations */}
      <DashboardClient />
    </>
  );
}
