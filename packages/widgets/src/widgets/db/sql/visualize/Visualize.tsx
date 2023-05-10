import { VisualizeRuntimeProps, VisualizeType } from './common';
import { lazy } from 'react';
import TableVisualize from './TableVisualize';

const GaugeVisualize = lazy(() => import('./GaugeVisualize'));
const LineChartVisualize = lazy(() => import('./LineChartVisualize'));
const BarChartVisualize = lazy(() => import('./BarChartVisualize'));

export default function Visualize ({ ...props }: VisualizeType & VisualizeRuntimeProps) {
  switch (props.type) {
    case 'table':
      return <TableVisualize {...props} />
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