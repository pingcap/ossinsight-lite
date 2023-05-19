import { getAllDashboards, getLibrary } from '@/app/api/layout/operations';
import { NextResponse } from 'next/server';
import { LayoutConfigV1 } from '@/src/types/config';

export async function GET () {
  const [[libraryStore, library], [dashboardsStore, dashboard]] = await Promise.all([getLibrary(), getAllDashboards()]);

  const config: LayoutConfigV1 = {
    version: 1,
    library,
    dashboard,
    libraryStore,
    dashboardsStore,
  };

  return NextResponse.json(config);
}
