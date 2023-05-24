import dynamic from 'next/dynamic';
import { VisualizeType } from './common';

const TableVisualizeConfig = dynamic(() => import('./TableVisualizeConfig'));
const GaugeVisualizeConfig = dynamic(() => import('./GaugeVisualizeConfig'));
const LineChartVisualizeConfig = dynamic(() => import('./LineChartVisualizeConfig'));
const BarChartVisualizeConfig = dynamic(() => import('./BarChartVisualizeConfig'));

export default function VisualizeConfig (props: VisualizeType) {
  switch (props.type) {
    case 'table':
      return <TableVisualizeConfig {...props} />;
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
