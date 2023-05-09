import { VisualizeRuntimeProps, VisualizeType } from './common';
import { lazy } from 'react';

const GaugeVisualize = lazy(() => import('./GaugeVisualize'));
const LineChartVisualize = lazy(() => import('./LineChartVisualize'));

export default function Visualize ({ ...props }: VisualizeType & VisualizeRuntimeProps) {
  switch (props.type) {
    case 'gauge':
      return <GaugeVisualize {...props} />;
    case 'chart:line':
      return <LineChartVisualize {...props} />;
    default:
      return <span>Unknown visualization</span>;
  }
}