import AppLoading from '@/components/AppLoading';
import AppLoadingIndicator from '@/components/AppLoadingIndicator';
import { MenuItem } from '@/packages/ui/components/menu';
import { NavMenu } from '@/packages/ui/components/nav-menu';
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
      position="top"
      className="h-[40px] p-[4px] min-w-[250px]"
      items={<><MenuItem id="sep" order={-1} separator />{top}</>}
    />
    <NavMenu
      position="bottom"
      className="h-[40px] p-[4px] min-w-[250px]"
      items={<><MenuItem id="sep" order={-1} separator />{bottom}</>}
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

