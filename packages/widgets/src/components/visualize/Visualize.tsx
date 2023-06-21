import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import dynamic from 'next/dynamic';
import { VisualizeRuntimeProps, VisualizeType } from './common';
import TableVisualize from './TableVisualize';

const GaugeVisualize = dynamic(() => import('./GaugeVisualize'));
const LineChartVisualize = dynamic(() => import('./LineChartVisualize'));
const BarChartVisualize = dynamic(() => import('./BarChartVisualize'));

export default function Visualize ({ ...props }: VisualizeType & VisualizeRuntimeProps) {
  if (props.running) {
    return <div className="flex w-full h-full gap-2 items-center justify-center text-secondary">
      <span>Executing SQL...</span>
      <LoadingIndicator />
    </div>;
  }
  switch (props.type) {
    case 'table':
      return <TableVisualize {...props} />;
    case 'gauge':
      return <GaugeVisualize {...props} />;
    case 'chart:line':
      return <LineChartVisualize {...props} />;
    case 'chart:bar':
      return <BarChartVisualize {...props} />;
    default:
      return <span>Unknown visualization</span>;
  }
}