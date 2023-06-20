import { getLibraryItem } from '@/app/(client)/api/layout/operations';
import { Unauthorized } from '@/components/Errors';
import WidgetPreviewPage from '@/components/pages/widget/WidgetPreviewPage';
import WidgetPreviewWithDetails from '@/components/pages/widget/WidgetPreviewWithDetails';
import { isReadonly } from '@/utils/server/auth';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const findItem = cache(getLibraryItem);

export default async function ({ params }: any) {
  const id = decodeURIComponent(params.id);

  const item = await findItem(id);

  if (!item) {
    notFound();
  }

  if (isReadonly() && item.visibility !== 'public') {
    return (
      <Unauthorized />
    );
  }

  return (
    <WidgetPreviewPage item={item} />
  );
}

export async function generateMetadata ({ params }: any): Promise<Metadata> {
  const id = decodeURIComponent(params.id);

  const item = await findItem(id);

  if (!item) {
    return {};
  }

  const title = item.props?.title ?? 'Untitled widget';
  const image = `/widgets/${params.id}/thumbnail.png`;

  return {
    title,
    openGraph: {
      title,
      images: image,
    },
    twitter: {
      title,
      card: 'summary_large_image',
      images: image,
    },
  };
}

export const dynamic = 'force-dynamic';
