import { VisualizeConfigProps, VisualizeType } from './common';
import { lazy } from 'react';

const GaugeVisualizeConfig = lazy(() => import('./GaugeVisualizeConfig'));
const LineChartVisualizeConfig = lazy(() => import('./LineChartVisualizeConfig'));

export default function VisualizeConfig (props: VisualizeType) {
  switch (props.type) {
    case 'gauge':
      return <GaugeVisualizeConfig {...props} />;
    case 'chart:line':
      return <LineChartVisualizeConfig {...props} />;
    default:
      return <span>Unknown visualization</span>;
  }
}