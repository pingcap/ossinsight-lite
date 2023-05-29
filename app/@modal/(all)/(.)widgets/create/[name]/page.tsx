import CreateWidget from '@/components/pages/widget/CreateWidget';

export default function ({ params }: any) {
  return (
    <CreateWidget name={decodeURIComponent(params.name)} />
  );
}
