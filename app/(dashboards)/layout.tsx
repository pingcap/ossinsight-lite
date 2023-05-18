'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Dashboard as DashboardConfig } from '@/src/types/config';
import React from 'react';
import Dashboard from '@/src/_pages/Dashboard';
import DashboardRegistry from '@/src/core/dashboard/Registry';
import DashboardAutoSave from '@/src/_pages/Dashboard/DashboardAutoSave';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';

export default function DashboardLayout ({ children }: any) {
  const [, name = 'default'] = useSelectedLayoutSegments();

  return (
    <>
      {/* TODO: What to put in page? */}
      {children}

      {/* This is primary component, prevent Layout component remount across navigations */}
      <Dashboard dashboardName={name} />

      <DashboardRegistry name={name} defaultDashboard={defaultDashboard} />
      <DashboardAutoSave dashboardName={name} />
    </>
  );
}

const defaultDashboard = (): DashboardConfig => {
  return {
    layout: { ...defaultLayoutConfig },
    items: [],
  };
};
