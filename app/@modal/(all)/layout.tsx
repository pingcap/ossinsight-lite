import AppLoading from '@/app/app-loading';
import dynamic from 'next/dynamic';

const DialogLayout = dynamic(() => import('./DialogLayout'), { ssr: false, loading: AppLoading });

export default function ({ children }: any) {
  return (
    <DialogLayout>
      {children}
    </DialogLayout>
  );
}
