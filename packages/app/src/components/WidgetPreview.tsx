import { Widget } from 'widgets-vite-plugin/types/widget';
import { CSSProperties, FC, lazy, Suspense, useMemo } from 'react';

export interface WidgetPreviewProps {
  name: string;
  widget: Widget;
  onLoadModule: (module: WidgetModule | null) => void;
}

export interface WidgetModule {
  default: FC<{ className?: string, style?: CSSProperties }>;
  title?: string;
  preferredSize?: {
    width?: number
    height?: number
    minWidth?: number
    maxWidth?: number
    aspectRatio?: number
  };
}

export default function WidgetPreview ({ name, widget, onLoadModule, ...props }: WidgetPreviewProps) {
  const Widget = useMemo(() => {
    if (widget.module) {
      return lazy(() => widget.module().then((module: any) => {
        onLoadModule(module)
        return module;
      }));
    }
    onLoadModule(null);
    return lazy(() => import(/* @vite-ignore */ '/' + widget.source).then(module => {
      onLoadModule(module);
      return module;
    }));
  }, [widget.source]);

  return (
    <Suspense
      fallback={'loading...'}
    >
      <Widget {...props} />
    </Suspense>
  );
}
