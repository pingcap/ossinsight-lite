import './globals.css';
import React, { ReactNode } from 'react';
import App from '@/src/App';
import { serverDashboardNames } from '@/app/api/layout/operations.server';

export default async function RootLayout ({
  children,
}: {
  children: ReactNode
}) {
  const [_, dashboardNames] = await serverDashboardNames();

  return (
    <html lang="en">
    <body>
    <App dashboardNames={dashboardNames}>
      {children}
    </App>
    </body>
    </html>
  );
}

