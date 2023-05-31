import { findItem } from '@/actions/widgets';
import WidgetPreviewWithDetails from '@/components/pages/widget/WidgetPreviewWithDetails';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function ({ params }: any) {
  const id = decodeURIComponent(params.id);

  const item = await findItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-2 bg-white rounded">
        <WidgetPreviewWithDetails item={item} />
      </div>
    </div>
  );
}

export async function generateMetadata ({ params }: any): Promise<Metadata> {
  const id = decodeURIComponent(params.id);

  const item = await findItem(id);

  if (!item) {
    return {};
  }

  const title = item.props.visualize?.title ?? 'Untitled widget';
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
