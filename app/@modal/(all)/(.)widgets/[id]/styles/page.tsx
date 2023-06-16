'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import AppLoading from '@/components/AppLoading';
import dynamic from 'next/dynamic';
import { useContext } from 'react';

const StyleEditor = dynamic(() => import('@/components/pages/modal/widgets/styles/StyleEditor'), { ssr: false, loading: AppLoading });

export default function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);
  const { useCompactMode, ...ctx } = useContext(ModalContext);
  useCompactMode(true);

  return <StyleEditor id={id} />;
}