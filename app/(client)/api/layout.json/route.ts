import { getAllDashboards, getLibrary } from '@/app/(client)/api/layout/operations';
import { LayoutConfigV1 } from '@/utils/types/config';
import { NextRequest, NextResponse } from 'next/server';

// import { authenticateApiGuard } from '@/utils/server/auth';

export async function GET (req: NextRequest) {
  // const res = await authenticateApiGuard(req);
  // if (res) {
  //   return res;
  // }

  const [libraryStore, library] = await getLibrary();
  const [dashboardsStore, dashboard] = await getAllDashboards();

  const config: LayoutConfigV1 = {
    version: 1,
    library,
    dashboard,
    libraryStore,
    dashboardsStore,
  };

  return NextResponse.json(config);
}

export const dynamic = 'force-dynamic';
