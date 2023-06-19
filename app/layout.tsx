import AppLoading from '@/components/AppLoading';
import AppLoadingIndicator from '@/components/AppLoadingIndicator';
import App from '@/core/App';
import '@/static/CabinSketch.css';
import cu from '@ossinsight-lite/widgets/src/widgets/oh-my-github/curr_user.sql?unique';
import Script from 'next/script';
import { Suspense } from 'react';
import './client-entry';
import './globals.scss';

export default function RootLayout ({
  children,
  modal,
}: any) {

  return (
    <html lang="en">
    <head>
      <Script id="gtag">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-PRPSXZS');`}</Script>
      <link rel="icon" type='image/png' href={cu.avatar_url} />
      <title>{cu.login}'s Dashboard | OSSInsight lite</title>
    </head>
    <body>
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PRPSXZS"
              height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
    </noscript>
    <App>
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

