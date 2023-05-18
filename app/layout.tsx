import './globals.css';
import React from 'react';
import App from '@/src/App';
import { getAllDashboards, getLibrary } from '@/app/api/layout/operations';
import { LayoutConfigV1 } from '@/src/types/config';

export default async function RootLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const [[dashboardsStore, dashboards], [libraryStore, library]] = await Promise.all([getAllDashboards(), getLibrary()]);

  return (
    <html lang="en">
    <body>
    <App config={{ version: 1, dashboard: dashboards, library, dashboardsStore, libraryStore } as LayoutConfigV1}>
      {children}
    </App>
    </body>
    </html>
  );
}

