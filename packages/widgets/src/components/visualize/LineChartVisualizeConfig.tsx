import { Field } from '@ossinsight-lite/ui/components/form';
import AxisFields from './AxisFields';
import { VisualizeLineChart } from './common';
import SwitchAxisFields from './SwitchAxisFields';

export default function LineChartVisualizeConfig ({}: VisualizeLineChart) {
  return (
    <>
      <SwitchAxisFields />
      <AxisFields axis="x" />
      <AxisFields axis="y" />
    </>
  );
}
