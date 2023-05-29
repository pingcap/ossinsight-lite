import CreateWidget from '@/components/pages/widget/CreateWidget';

export default function ({ params }: any) {
  return (
    <div className='h-screen overflow-hidden'>
      <CreateWidget name={decodeURIComponent(params.name)} />
    </div>
  );
}
