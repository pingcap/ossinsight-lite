import { VisualizeConfigProps, VisualizeLineChart } from './common';
import { Field } from '@oss-widgets/ui/components/form';
import AxisFields from './AxisFields';

export default function LineChartVisualizeConfig ({}: VisualizeLineChart) {
  return (
    <>
      <Field
        label="Title"
        control={<input className="outline-none bg-transparent text-white flex-1 border-b px-2 py-1" placeholder="Input a title" />}
        name="title"
      />
      <AxisFields axis="x" />
      <AxisFields axis="y" />
    </>
  );
}
