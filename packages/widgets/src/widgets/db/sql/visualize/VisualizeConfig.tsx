import { VisualizeConfigProps, VisualizeType } from './common';
import ValueVisualizeConfig from './ValueVisualizeConfig';

export default function VisualizeConfig (props: VisualizeType & VisualizeConfigProps) {
  switch (props.type) {
    case 'value':
      return <ValueVisualizeConfig {...props} />;
    default:
      return <span>Unknown visualization</span>;
  }
}