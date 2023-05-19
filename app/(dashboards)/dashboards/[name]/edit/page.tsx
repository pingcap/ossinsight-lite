import React from 'react';
import DashboardServer from '@/app/(dashboards)/dashboard.server';

export default function Page ({ params }: any) {
  return <DashboardServer name={params.name} />;
}

export const dynamic = 'force-dynamic';
