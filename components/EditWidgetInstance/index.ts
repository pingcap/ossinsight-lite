import AppLoading from '@/components/AppLoading';
import dynamic from 'next/dynamic';

const EditWidgetInstance = dynamic(() => import('./EditWidgetInstance'), { ssr: false, loading: AppLoading });

export default EditWidgetInstance;