import React from 'react';
import DashboardServer from '@/app/(dashboards)/dashboard.server';

export default async function Page () {
  return (
    <DashboardServer name="default" />
  );
}

export const dynamic = 'force-dynamic';
