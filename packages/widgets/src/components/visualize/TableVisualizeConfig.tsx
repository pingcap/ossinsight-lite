import { Field } from '@ossinsight-lite/ui/components/form';
import { VisualizeTable } from './common';

export default function TableVisualizeConfig ({}: VisualizeTable) {

  return (
    <div className="relative">
      <Field
        label="Title"
        control={<input className="outline-none flex-1 border-b px-2 py-1" placeholder="Input a title" />}
        name="title"
      />
    </div>
  );
}
