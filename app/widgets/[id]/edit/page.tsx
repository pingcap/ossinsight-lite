import { getLibraryItem } from '@/app/(client)/api/layout/operations';
import EditWidget from '@/components/pages/widget/EditWidget';

export default async function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);
  const [, item] = await getLibraryItem(id);

  return (
    <div className='h-screen overflow-hidden'>
      <EditWidget id={id} />
    </div>
  );
}
