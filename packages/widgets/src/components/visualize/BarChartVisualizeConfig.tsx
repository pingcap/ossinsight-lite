import { Field } from '@ossinsight-lite/ui/components/form';
import AxisFields from './AxisFields';
import { VisualizeBarChart } from './common';
import SwitchAxisFields from './SwitchAxisFields';

export default function LineChartVisualizeConfig ({}: VisualizeBarChart) {
  return (
    <>
      <SwitchAxisFields />
      <AxisFields axis="x" />
      <AxisFields axis="y" />
    </>
  );
}
