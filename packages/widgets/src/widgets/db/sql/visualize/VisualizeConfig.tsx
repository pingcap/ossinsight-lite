import { VisualizeConfigProps, VisualizeGauge } from './common';
import GaugeVisualizeConfig from './GaugeVisualizeConfig';

export default function VisualizeConfig (props: VisualizeGauge & VisualizeConfigProps) {
  switch (props.type) {
    case 'gauge':
      return <GaugeVisualizeConfig {...props} />;
    default:
      return <span>Unknown visualization</span>;
  }
}