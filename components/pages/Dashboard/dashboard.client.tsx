'use client';

import Dashboard from '@/components/pages/Dashboard';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { useAuthGuard } from '@/utils/useAuth';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useState } from 'react';

export default function DashboardClient ({ top }: { top: any }) {
  const [, name = 'default'] = useSelectedLayoutSegments();
  const [editing, setEditing] = useState(false);
  const toggleEditing = useAuthGuard(() => setEditing(editing => !editing), !editing);

  return (
    <DashboardContext.Provider
      value={{
        dashboardName: name,
        editing,
        toggleEditing,
      }}
    >
      {top}
      <Dashboard />
    </DashboardContext.Provider>
  );
}
