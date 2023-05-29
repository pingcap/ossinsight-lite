'use client';
import AppLoading from '@/components/AppLoading';
import dynamic from 'next/dynamic';

const StyleEditor = dynamic(() => import('@/components/pages/modal/widgets/styles/StyleEditor'), { ssr: false, loading: AppLoading });

export default function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);

  return <StyleEditor id={id} />;
}