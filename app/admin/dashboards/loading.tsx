import LoadingIndicator from '@/src/components/LoadingIndicator';

export default function Loading () {
  return (
    <div className="flex-1 h-screen flex items-center justify-center gap-2">
      <LoadingIndicator />
      Loading...
    </div>
  );
}