import { useFormContext } from '@ossinsight-lite/ui/components/form';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { VisualizeBarChart, VisualizeLineChart } from './common';

export default function SwitchAxisFields () {
  const { getValues, setValue } = useFormContext<VisualizeLineChart | VisualizeBarChart>();

  const handleSwitchAxis = useRefCallback(() => {
    const values = getValues();
    const [x, y] = getValues(['x', 'y']);
    setValue('x', y);
    setValue('y', x, { shouldTouch: true });
  });

  return (
    <button className="btn btn-default" type="button" onClick={handleSwitchAxis}>
      Switch Axis
    </button>
  );
}