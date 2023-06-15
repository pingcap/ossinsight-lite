import AppLoading from '@/components/AppLoading';
import dynamic from 'next/dynamic';

const DialogLayout = dynamic(() => import('@/components/pages/modal/DialogLayout'), { ssr: false, loading: AppLoading });

export default function ({ children }: any) {
  return (
    <DialogLayout compact>
      {children}
    </DialogLayout>
  );
}
