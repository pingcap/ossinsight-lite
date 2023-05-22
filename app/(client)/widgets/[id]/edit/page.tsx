import { getLibraryItem } from '@/app/admin/widgets/op';
import EditWidgetInstance from '@/src/_pages/EditWidgetInstance';

export default async function ({ params }: any) {
  const item = await getLibraryItem(decodeURIComponent(params.id));

  return (
    <EditWidgetInstance id={params.id} item={item} />
  );
}
