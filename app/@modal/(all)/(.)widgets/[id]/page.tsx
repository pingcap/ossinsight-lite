import { findItem } from '@/actions/widgets';
import WidgetPreviewWithDetails from '@/components/pages/widget/WidgetPreviewWithDetails';
import { notFound } from 'next/navigation';

export default async function ({ params }: any) {
  const id = decodeURIComponent(params.id);

  const item = await findItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className='h-full flex items-center overflow-hidden'>
      <WidgetPreviewWithDetails item={item} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
