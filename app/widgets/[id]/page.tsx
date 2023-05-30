import WidgetPreview from '@/components/WidgetPreview';
import { sql } from '@/utils/mysql';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export default async function ({ params }: any) {
  const id = decodeURIComponent(params.id);

  const item = await findItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center p-2 min-h-screen">
      <div className="max-w-[640px] min-h-[480px] max-h-[480px] flex-1 flex flex-col">
        <WidgetPreview id={item.id} name={item.name} props={item.props} />
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
};

export const dynamic = 'force-dynamic';

const findItem = cache(async function findItem (id: string) {
  return await sql.unique<{ id: string, name: string, props: any }>`
      SELECT properties AS props, widget_name AS name, id
      FROM library_items
      WHERE id = ${id}
        AND widget_name = 'db/sql'
  `;
});
