import widgetsManifest, { ResolvedWidgetModule } from '../widgets-manifest';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { useWidgetCache } from './WidgetsManager';
import dynamic from 'next/dynamic';
import LoadingIndicator from '@/src/components/LoadingIndicator';

export interface WidgetInstanceProps {
  name: string;
  props: any;
  configuring?: boolean;
  onLoad?: (module: ResolvedWidgetModule) => void;
}

const WidgetInstance = forwardRef<HTMLDivElement, WidgetInstanceProps>(function ({ name, configuring = false, props, onLoad }, ref) {
  const cache = useWidgetCache();
  const mounted = useRef(true);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const WidgetComponent = useMemo(() => {
    if (cache[name]) {
      setTimeout(() => {
        if (mounted.current) {
          onLoad?.(cache[name]);
        }
      }, 0);
      return cache[name].default;
    }

    return dynamic(() => widgetsManifest[name]
      .module()
      .then(module => {
        const Widget = forwardRef(module.default);
        const { default: _, ...others } = module;
        const resolvedModule = cache[name] = {
          default: Widget,
          ...others,
        };
        setTimeout(() => {
          if (mounted.current) {
            onLoad?.(resolvedModule);
          }
        }, 0);
        return Widget;
      }), {
      loading: () => (
        <div className="w-full h-full flex items-center justify-center text-gray-400 gap-2">
          <LoadingIndicator /> Loading...
        </div>
      ),
    });
  }, [name]);

  return <WidgetComponent {...props} ref={ref} />;
});

export default WidgetInstance;
