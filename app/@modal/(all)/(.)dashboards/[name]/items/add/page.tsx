import { getDashboardAbsentLibraryItems } from '@/app/(client)/api/layout/operations';
import Sections from '@/components/pages/modal/widgets/add/Sections';

export default async function Page ({ params }: any) {
  const dashboardName = decodeURIComponent(params.name);
  const items = await getDashboardAbsentLibraryItems(dashboardName);

  return (
    <div className="font-sketch">
      <h2 className="text-xl font-bold">Add widget</h2>
      <Sections items={items} dashboardName={dashboardName} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
