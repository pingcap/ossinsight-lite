'use client';
import AppLoading from '@/components/AppLoading';
import dynamic from 'next/dynamic';

const StyleEditor = dynamic(() => import('@/components/pages/modal/widgets/styles/StyleEditor'), { ssr: false, loading: AppLoading });

export default function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);

  return (
    <div className='h-screen overflow-hidden flex justify-center items-center bg-gray-50'>
      <div className='p-2 border rounded bg-white'>
        <StyleEditor id={id} />
      </div>
    </div>
  );
}