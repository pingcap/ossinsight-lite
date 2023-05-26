import AppLoading from '@/app/app-loading';
import AppLoadingIndicator from '@/app/AppLoadingIndicator';
import { NavMenu } from '@/packages/ui/components/nav-menu';
import AppMenu from '@/src/AppMenu';
import { Suspense } from 'react';
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
      position="top"
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
      position="bottom"
      className="h-[40px] p-[4px] min-w-[250px]"
      items={(
        <>
          <AppMenu />
          {bottom}
        </>
      )}
    />
    <Suspense fallback={<AppLoading />}>
      {children}
    </Suspense>
    <Suspense fallback={<AppLoading />}>
      {modal}
    </Suspense>
    <AppLoadingIndicator />
    </body>
    </html>
  );
}

