import LoadingIndicator from '@/src/components/LoadingIndicator';

export default function Loading () {
  return (
    <div className='h-full flex items-center justify-center text-lg text-gray-400 gap-2'>
      <LoadingIndicator />
      Loading...
    </div>
  )
}
