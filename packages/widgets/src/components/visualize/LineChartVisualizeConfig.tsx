import { Field } from '@ossinsight-lite/ui/components/form';
import AxisFields from './AxisFields';
import { VisualizeLineChart } from './common';
import SwitchAxisFields from './SwitchAxisFields';

export default function LineChartVisualizeConfig ({}: VisualizeLineChart) {
  return (
    <>
      {/*<Field*/}
      {/*  label="Title"*/}
      {/*  control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a title" />}*/}
      {/*  name="title"*/}
      {/*/>*/}
      <SwitchAxisFields />
      <AxisFields axis="x" />
      <AxisFields axis="y" />
    </>
  );
}
