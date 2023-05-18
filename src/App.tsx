'use client';
import React, { PropsWithChildren } from 'react';

import WidgetsManager from './components/WidgetsManager';
import { NavMenu } from '@ossinsight-lite/ui/components/nav-menu';
import AppMenu from '@/src/AppMenu';
import DashboardsRegistry from '@/src/bind/DashboardsRegistry';
import LibraryRegistry from '@/src/bind/LibraryRegistry';
import AutoSaveLibrary from '@/src/components/WidgetsManager/AutoSaveLibrary';
import { LayoutConfigV1 } from '@/src/types/config';

export default function App ({ children, config }: PropsWithChildren<{ config: LayoutConfigV1 }>) {
  return (
    <WidgetsManager config={config}>
      <NavMenu name="nav" className="h-[40px] p-[4px] min-w-[250px]">
        <AppMenu />
        {children}
      </NavMenu>

      <LibraryRegistry />
      <DashboardsRegistry />
    </WidgetsManager>
  );
}

