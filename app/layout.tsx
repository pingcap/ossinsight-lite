import AppLoading from '@/components/AppLoading';
import AppLoadingIndicator from '@/components/AppLoadingIndicator';
import App from '@/core/App';
import { MenuItem } from '@/packages/ui/components/menu';
import { NavMenu } from '@/packages/ui/components/nav-menu';
import { Suspense } from 'react';
import './client-entry';
import './globals.scss';
import '@/static/CabinSketch.css';

export default function RootLayout ({
  children,
  modal,
  bottom,
}: any) {

  return (
    <html lang="en">
    <body>
    <App>
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
    </App>
    </body>
    </html>
  );
}

