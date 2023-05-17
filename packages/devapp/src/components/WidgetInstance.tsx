import widgetsManifest from '../widgets-manifest';
import { forwardRef, lazy, useMemo } from 'react';
import { useWidgetCache } from './WidgetsManager';

export interface WidgetInstanceProps {
  name: string;
  props: any;
  configuring?: boolean;
}

const WidgetInstance = forwardRef<HTMLDivElement, WidgetInstanceProps>(function ({ name, configuring = false, props }, ref) {
  const cache = useWidgetCache();
  const WidgetComponent = useMemo(() => {
    if (cache[name]) {
      return cache[name];
    }

    return lazy(() => widgetsManifest[name]
      .module()
      .then(module => {
        const Widget = forwardRef(module.default);
        return {
          default: cache[name] = Widget,
        };
      }));
  }, [name]);

  return <WidgetComponent {...props} ref={ref} />;
});

export default WidgetInstance;
