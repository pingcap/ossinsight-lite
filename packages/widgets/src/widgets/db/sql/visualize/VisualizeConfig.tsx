import { VisualizeType } from './common';
import { lazy } from 'react';

const GaugeVisualizeConfig = lazy(() => import('./GaugeVisualizeConfig'));
const LineChartVisualizeConfig = lazy(() => import('./LineChartVisualizeConfig'));
const BarChartVisualizeConfig = lazy(() => import('./BarChartVisualizeConfig'));

export default function VisualizeConfig (props: VisualizeType) {
  switch (props.type) {
    case 'table':
      return <></>
    case 'gauge':
      return <GaugeVisualizeConfig {...props} />;
    case 'chart:line':
      return <LineChartVisualizeConfig {...props} />;
    case 'chart:bar':
      return <BarChartVisualizeConfig {...props} />;
    default:
      return <span>Unknown visualization</span>;
  }
}
