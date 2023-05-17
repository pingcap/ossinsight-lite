import widgetsManifest, { WidgetModule } from '../widgets-manifest';
import { forwardRef, lazy, useMemo } from 'react';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { useWidgetCache } from './WidgetsManager';

export interface WidgetInstanceProps {
  name: string;
  onWidgetLoad?: (module: WidgetModule) => void;
  props: any;
  configuring?: boolean;
}

const WidgetInstance = forwardRef<HTMLDivElement, WidgetInstanceProps>(function ({ name, onWidgetLoad, configuring = false, props }, ref) {
  const cache = useWidgetCache();
  const handleWidgetLoad = useRefCallback(onWidgetLoad);
  const WidgetComponent = useMemo(() => {
    if (cache[name]) {
      return cache[name];
    }

    return lazy(() => widgetsManifest[name].module().then(module => {
      const Widget = forwardRef(module.default);

      handleWidgetLoad(module);

      return {
        default: cache[name] = Widget,
      };
    }));
  }, [name]);

  return <WidgetComponent {...props} ref={ref} />;
});

export default WidgetInstance;
