import { Field } from '@ossinsight-lite/ui/components/form';
import ColumnSelect from './ColumnSelect';

export type BaseAxis = 'x' | 'y';

export interface AxisFieldsProps<Axis extends BaseAxis> {
  axis: Axis;
}

export default function AxisFields<Axis extends BaseAxis> ({ axis }: AxisFieldsProps<Axis>) {
  return (
    <fieldset className='p-4 mt-2 border'>
      <legend className=''>{axis.toUpperCase()} Axis</legend>
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
        control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a title" />}
        name={`${axis}.type`}
      />
    </fieldset>
  );
}


