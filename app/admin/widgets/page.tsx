import { getWidgets } from '@/actions/widgets';
import Items from '@/components/pages/admin/widgets/items';

export default async function Page () {
  return (
    <div className="container m-auto py-4">
      <h1 className="text-xl">Widgets list</h1>
      <Items items={await getWidgets()} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
