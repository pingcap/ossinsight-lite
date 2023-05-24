import { VisualizeRuntimeProps, VisualizeType } from './common';
import TableVisualize from './TableVisualize';
import dynamic from 'next/dynamic';

const GaugeVisualize = dynamic(() => import('./GaugeVisualize'));
const LineChartVisualize = dynamic(() => import('./LineChartVisualize'));
const BarChartVisualize = dynamic(() => import('./BarChartVisualize'));

export default function Visualize ({ ...props }: VisualizeType & VisualizeRuntimeProps) {
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