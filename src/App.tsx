'use client';
import React, { PropsWithChildren } from 'react';

import WidgetsManager from './components/WidgetsManager';
import { NavMenu } from '@ossinsight-lite/ui/components/nav-menu';
import AppMenu from '@/src/AppMenu';

export default function App ({ children, dashboardNames }: PropsWithChildren<{ dashboardNames: string[] }>) {
  return (
    <WidgetsManager>
      <NavMenu name="nav" className="h-[40px] p-[4px] min-w-[250px]">
        <AppMenu dashboardNames={dashboardNames} />
        {children}
      </NavMenu>
    </WidgetsManager>
  );
}
