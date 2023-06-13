import { VisualizeGauge } from './common';
import NoConfigurableItems from './NoConfigurableItems';

export default function GaugeVisualizeConfig ({}: VisualizeGauge) {

  return (
    <div className="relative">
      <NoConfigurableItems />
    </div>
  );
}
