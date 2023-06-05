import { getLibrary } from '@/app/(client)/api/layout/operations';
import Items from '@/components/pages/admin/widgets/items';

export default async function Page () {
  const items = await getLibrary(false);

  return (
    <div className="container m-auto py-4">
      <h1 className="text-xl">Widgets list</h1>
      <Items items={items} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
