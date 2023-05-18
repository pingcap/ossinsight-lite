'use client';
import React, { PropsWithChildren } from 'react';

import WidgetsManager from './components/WidgetsManager';
import { NavMenu } from '@oss-widgets/ui/components/nav-menu';
import AppMenu from '@/src/AppMenu';
import DashboardsRegistry from '@/src/bind/DashboardsRegistry';
import LibraryRegistry from '@/src/bind/LibraryRegistry';
import AutoSaveLibrary from '@/src/components/WidgetsManager/AutoSaveLibrary';

export default function App ({ children }: PropsWithChildren) {
  return (
    <WidgetsManager>
      <NavMenu name="nav" className="h-[40px] p-[4px] min-w-[250px]">
        <AppMenu />
        {children}
      </NavMenu>

      <LibraryRegistry />
      <DashboardsRegistry />
    </WidgetsManager>
  );
}

