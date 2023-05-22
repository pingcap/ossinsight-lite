import React from 'react';
import DashboardServer from '@/app/(client)/(dashboards)/dashboard.server';
import { authenticateGuard } from '@/src/auth';

export default async function Page () {
  await authenticateGuard('/')

  return (
    <DashboardServer name="default" />
  );
}

export const dynamic = 'force-dynamic';
