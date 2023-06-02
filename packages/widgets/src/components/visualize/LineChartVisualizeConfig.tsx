import { Field } from '@ossinsight-lite/ui/components/form';
import AxisFields from './AxisFields';
import { VisualizeLineChart } from './common';

export default function LineChartVisualizeConfig ({}: VisualizeLineChart) {
  return (
    <>
      {/*<Field*/}
      {/*  label="Title"*/}
      {/*  control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a title" />}*/}
      {/*  name="title"*/}
      {/*/>*/}
      <AxisFields axis="x" />
      <AxisFields axis="y" />
    </>
  );
}
