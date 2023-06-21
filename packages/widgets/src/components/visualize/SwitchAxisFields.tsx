import { useFormContext } from '@ossinsight-lite/ui/components/form';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { VisualizeBarChart, VisualizeLineChart } from './common';

export default function SwitchAxisFields () {
  const { onBatchChange } = useFormContext<VisualizeLineChart | VisualizeBarChart>();

  const handleSwitchAxis = useRefCallback(() => {
    onBatchChange(draft => {
      const x = { ...draft.x };
      const y = { ...draft.y };
      draft.y = x;
      draft.x = y;
    });
  });

  return (
    <button className="btn btn-default" type="button" onClick={handleSwitchAxis}>
      Switch Axis
    </button>
  );
}