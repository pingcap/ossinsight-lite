import { getLibraryItem } from '@/app/(client)/api/layout/operations';
import { ModalContext } from '@/app/@modal/(all)/context';
import { Unauthorized } from '@/components/Errors';
import WidgetPreviewWithDetails from '@/components/pages/widget/WidgetPreviewWithDetails';
import { isReadonly } from '@/utils/server/auth';
import { notFound } from 'next/navigation';
import { useContext } from 'react';

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
    <WidgetPreviewWithDetails item={item} />
  );
}

export const dynamic = 'force-dynamic';
