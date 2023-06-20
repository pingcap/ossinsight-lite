import { Field } from '@ossinsight-lite/ui/components/form';
import AxisTypeSelect from './AxisTypeSelect';
import ColumnSelect from './ColumnSelect';

export type BaseAxis = 'x' | 'y';

export interface AxisFieldsProps<Axis extends BaseAxis> {
  axis: Axis;
}

export default function AxisFields<Axis extends BaseAxis> ({ axis }: AxisFieldsProps<Axis>) {
  return (
    <section className="mt-8 w-full overflow-hidden">
      <h3 className="font-bold mb-2">{axis.toUpperCase()} Axis</h3>
      <Field
        label="Field"
        control={<ColumnSelect />}
        name={`${axis}.field`}
      />
      <Field
        label="Axis Label"
        control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a title" />}
        name={`${axis}.label`}
      />
      <Field
        label="Axis type"
        control={<AxisTypeSelect />}
        name={`${axis}.type`}
      />
    </section>
  );
}


