'use client';

import Dashboard from '@/src/_pages/Dashboard';
import React from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Dashboard as DashboardConfig } from '@/src/types/config';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';

export default function DashboardClient () {
  const [, name = 'default', mode] = useSelectedLayoutSegments();
  const editing = mode === 'edit';

  return (
    <>
      <Dashboard dashboardName={name} editMode={editing} />
    </>
  );
}

const defaultDashboard = (): DashboardConfig => {
  return {
    layout: { ...defaultLayoutConfig },
    items: [],
  };
};
