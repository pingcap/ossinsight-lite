import DashboardServer from '@/app/(client)/(dashboards)/dashboard.server';
import React from 'react';

export default async function Page () {
  return (
    <DashboardServer name="default" />
  );
}

export const dynamic = 'force-dynamic';
