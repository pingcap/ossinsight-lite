import { VisualizeRuntimeProps, VisualizeType } from './common';
import GaugeVisualize from './GaugeVisualize';

export default function Visualize ({ ...props }: VisualizeType & VisualizeRuntimeProps) {
  switch (props.type) {
    case 'gauge':
      return <GaugeVisualize {...props} />;
    default:
      return <span>Unknown visualization</span>
  }
}