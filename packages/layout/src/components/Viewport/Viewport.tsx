import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import mergeRefs from '@ossinsight-lite/ui/utils/merge-refs';
import clsx from 'clsx';
import { forwardRef, ReactNode, useEffect, useState } from 'react';
import { DraggableContextProvider } from '../../context/draggable';
import { Layout } from '../../core/layout/base';
import { Rect, Size, toSizeStyle } from '../../core/types';
import { useSize } from '../../hooks/size';
import './style.scss';

export interface ViewportProps {
  layout: Layout<any, any>;
  children?: ReactNode;
  className?: string;
  onResize?: (size: Size) => void;
  onGridResize?: (size: Size) => void;
  onDrag?: (id: string, rect: Rect) => void;
}

const Viewport = forwardRef<HTMLDivElement, ViewportProps>(function Viewport ({ className, layout, onDrag, children, onResize }, forwardedRef) {
  const { ref: wrapperRef, size: wrapperSize } = useSize<HTMLDivElement>({ onResize });

  const onResizeRef = useRefCallback(onResize ?? (() => {}));

  const [viewportSize, setViewportSize] = useState(() => {
    const newSize = layout.computeViewportSize(wrapperSize);
    const [, , w, h] = layout.toDomShape([0, 0, ...newSize]);
    return [w, h] as Size;
  });

  useEffect(() => {
    const newSize = layout.computeViewportSize(wrapperSize);
    const [, , w, h] = layout.toDomShape([0, 0, ...newSize]);
    setViewportSize([w, h]);
    onResizeRef(newSize);
  }, [wrapperSize, layout]);

  useTrackWindowResize();

  return (
    <DraggableContextProvider value={{ layout, onDrag, viewportSize }}>
      <div ref={mergeRefs(wrapperRef, forwardedRef)} className={clsx('viewport-wrapper', className)}>
        <div className="viewport" style={toSizeStyle(viewportSize)}>
          {children}
        </div>
      </div>
    </DraggableContextProvider>
  );
});

Viewport.displayName = 'Viewport';

let viewport_count = 0;

let t: ReturnType<typeof setTimeout> | undefined;

function onWindowResize () {
  clearTimeout(t);
  window.document.body.classList.add('r-layout-resizing');
  t = setTimeout(() => {
    window.document.body.classList.remove('r-layout-resizing');
  }, 500);
}

function useTrackWindowResize () {
  useEffect(() => {
    viewport_count++;
    if (viewport_count === 1)
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', onWindowResize, { passive: true });
      }
  }, []);
  return () => {
    viewport_count--;
    if (viewport_count === 0) {
      window.removeEventListener('resize', onWindowResize);
    }
  };
}

export default Viewport;
