import { getLibraryItem } from '@/app/(client)/api/layout/operations';
import { Unauthorized } from '@/components/Errors';
import WidgetPreviewWithDetails from '@/components/pages/widget/WidgetPreviewWithDetails';
import { isReadonly } from '@/utils/server/auth';
import { notFound } from 'next/navigation';

export default async function ({ params }: any) {
  const id = decodeURIComponent(params.id);

  const item = await getLibraryItem(id);

  if (!item) {
    notFound();
  }

  if (isReadonly() && item.visibility !== 'public') {
    return (
      <Unauthorized />
    );
  }

  return (
    <div className="h-full flex items-center overflow-hidden">
      <WidgetPreviewWithDetails item={item} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
