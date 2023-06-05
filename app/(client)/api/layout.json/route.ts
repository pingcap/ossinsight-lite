import { getAllDashboards, getLibrary } from '@/app/(client)/api/layout/operations';
import { isReadonly } from '@/utils/server/auth';
import { LayoutConfigV1 } from '@/utils/types/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest) {
  const readonly = isReadonly(req);
  const [libraryStore, library] = await getLibrary(readonly);
  const [dashboardsStore, dashboard] = await getAllDashboards(readonly);

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
