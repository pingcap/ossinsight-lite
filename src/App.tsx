'use client';
import { Menu } from '@/packages/ui/components/menu/Menu';
import AppMenu from '@/src/AppMenu';
import { NavMenu } from '@ossinsight-lite/ui/components/nav-menu';
import React, { PropsWithChildren, Suspense } from 'react';

import WidgetsManager from './components/WidgetsManager';

export default function App ({ children, dashboardNames }: PropsWithChildren<{ dashboardNames: string[] }>) {
  return (
    <WidgetsManager>
      <Menu name="nav">
        <NavMenu auto={false} name="nav" className="h-[40px] p-[4px] min-w-[250px]" items={<AppMenu dashboardNames={dashboardNames} />} />

        <Suspense>
          {children}
        </Suspense>
      </Menu>
    </WidgetsManager>
  );
}
