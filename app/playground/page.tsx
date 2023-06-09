import DefaultMenu from '@/components/menu/DefaultMenu';
import TiDBCloudPlayground from '@/components/TiDBCloudPlayground';

export default function () {
  return (
    <div className='h-screen p-2'>
      <TiDBCloudPlayground />
      <DefaultMenu />
    </div>
  );
}
