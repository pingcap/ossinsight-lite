import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';

export default function Loading () {
  return (
    <div className="font-sketch">
      <h2 className="text-xl font-bold">Add widget</h2>
      <div className="h-[240px] flex items-center justify-center text-lg text-gray-400 gap-2">
        <LoadingIndicator />
        Loading...
      </div>
    </div>
  );
}
