import EditWidget from '@/components/pages/widget/EditWidget';

export default async function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);

  return (
    <EditWidget id={id} />
  );
}
