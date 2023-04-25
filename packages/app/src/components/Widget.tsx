import type { Widget } from 'widgets-vite-plugin/types/widget';
import WidgetPreview, { WidgetModule } from './WidgetPreview';
import WidgetWrapper from './WidgetWrapper';
import { useState } from 'react';
import widgets from 'app:widgets-manifest';

export default function Widget ({ name, widget }: { name: string, widget: Widget }) {
  const [module, setModule] = useState<WidgetModule | null>(widgets.module);
  return (
    <div className="widget">
      <WidgetWrapper name={name} module={module}>
        <WidgetPreview name={name} widget={widget} onLoadModule={setModule} />
      </WidgetWrapper>
    </div>
  );
}