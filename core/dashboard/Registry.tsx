import ClientEffect from '@/core/dashboard/Registry.client';
import { Dashboard, LibraryItem } from '@/utils/types/config';

function DashboardRegistry ({ name, dashboard: dashboardConfig, library: libraryItems, readonly }: { name: string, dashboard: Dashboard, library: LibraryItem[], readonly: boolean }) {
  return <ClientEffect name={name} dashboard={dashboardConfig} library={libraryItems} readonly={readonly} />;
}

export default DashboardRegistry;
