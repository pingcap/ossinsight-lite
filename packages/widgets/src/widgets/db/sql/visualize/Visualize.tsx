import { VisualizeRuntimeProps, VisualizeType } from './common';
import ValueVisualize from './ValueVisualize';

export default function Visualize ({ ...props }: VisualizeType & VisualizeRuntimeProps) {
  switch (props.type) {
    case 'value':
      return <ValueVisualize {...props} />;
    default:
      return <span>Unknown visualization</span>
  }
}