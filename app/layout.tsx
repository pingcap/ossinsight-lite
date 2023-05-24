import AppRoutingIndicator from '@/app/AppRoutingIndicator';
import { NavMenu } from '@/packages/ui/components/nav-menu';
import AppMenu from '@/src/AppMenu';
import React from 'react';
import './globals.scss';

export default function RootLayout ({
  children,
  modal,
  navMenu,
}: any) {

  return (
    <html lang="en">
    <body>
    <NavMenu
      simple
      name="nav"
      className="h-[40px] p-[4px] min-w-[250px]"
      items={(
        <>
          <AppMenu />
          {navMenu}
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

