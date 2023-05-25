import { Alert } from '@/src/components/Alert';

export default function () {
  return (
    <div className='flex min-h-screen justify-center items-center'>
      <Alert type="error" title="Database not configured" message="Make sure your Vercel project linked to TiDB Cloud Integration." />
    </div>
  );
}