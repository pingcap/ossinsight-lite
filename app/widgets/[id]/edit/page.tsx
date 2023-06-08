import { getLibraryItem } from '@/app/(client)/api/layout/operations';
import { Unauthorized } from '@/components/Errors';
import EditWidget from '@/components/pages/widget/EditWidget';
import { isReadonly } from '@/utils/server/auth';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import Script from 'next/script';

export default async function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);
  const item = await getLibraryItem(id);
  if (!item) {
    return notFound();
  }

  if (isReadonly() && item.visibility !== 'public') {
    return <Unauthorized />;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Head>
        <Script id="__ssr_library_items">{`window.__ssr_library_items = ${JSON.stringify(item)}`}</Script>
      </Head>
      <EditWidget id={id} item={item} />
    </div>
  );
}
