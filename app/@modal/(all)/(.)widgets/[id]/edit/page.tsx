import EditWidget from '@/components/pages/widget/EditWidget';

export default function Page ({ params }: any) {

  return (
    <EditWidget id={decodeURIComponent(params.id)} />
  );
}
