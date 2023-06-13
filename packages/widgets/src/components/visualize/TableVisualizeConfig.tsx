import { VisualizeTable } from './common';
import NoConfigurableItems from './NoConfigurableItems';

export default function TableVisualizeConfig ({}: VisualizeTable) {

  return (
    <div className="relative">
      <NoConfigurableItems />
    </div>
  );
}
