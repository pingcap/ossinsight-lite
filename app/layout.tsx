import AppRoutingIndicator from '@/app/AppRoutingIndicator';
import { NavMenu } from '@/packages/ui/components/nav-menu';
import AppMenu from '@/src/AppMenu';
import React from 'react';
import './globals.scss';

export default function RootLayout ({
  children,
  modal,
  top,
  bottom,
}: any) {

  return (
    <html lang="en">
    <body>
    <NavMenu
      simple
      name="nav"
      position='top'
      className="h-[40px] p-[4px] min-w-[250px]"
      items={(
        <>
          <AppMenu />
          {top}
        </>
      )}
    />
    <NavMenu
      simple
      name="nav"
      position='bottom'
      className="h-[40px] p-[4px] min-w-[250px]"
      items={(
        <>
          <AppMenu />
          {bottom}
        </>
      )}
    />
    {children}
    {modal}
    <AppRoutingIndicator />
    </body>
    </html>
  );
}

