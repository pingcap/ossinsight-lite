'use client';

import Dashboard from '@/components/pages/Dashboard';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { isDemoSite } from '@/components/SiteHeader/utils';
import { useAuthGuard } from '@/utils/useAuth';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useCallback, useState } from 'react';

export default function DashboardClient ({ top }: { top: any }) {
  const [, name = 'default'] = useSelectedLayoutSegments();
  const [editing, setEditing] = useState(false);
  const toggleEditing = useAuthGuard(() => setEditing(editing => !editing), isDemoSite(), !editing);
  const exitEditing = useCallback(() => setEditing(false), []);

  return (
    <DashboardContext.Provider
      value={{
        dashboardName: decodeURIComponent(name),
        editing,
        toggleEditing,
        exitEditing,
      }}
    >
      {top}
      <Dashboard />
    </DashboardContext.Provider>
  );
}
