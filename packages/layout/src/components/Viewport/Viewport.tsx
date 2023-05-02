import { CSSProperties, FC, ReactNode, useEffect, useMemo, useRef } from 'react';
import { Layout } from '../../core/layout/base.ts';
import { DraggableContextProvider } from '../../context/draggable.ts';
import './style.scss';
import { useSize } from '../../hooks/size.ts';
import { Size, toSizeStyle } from '../../core/types.ts';

export interface ViewportProps {
  layout: Layout<any, any>;
  children?: ReactNode;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  onResize?: (size: Size) => void;
}

const Viewport: FC<ViewportProps> = function Viewport ({ layout, width, height, children, onResize }) {
  const { ref: wrapperRef, size: wrapperSize } = useSize<HTMLDivElement>({ onResize });

  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const viewportSize: Size = useMemo(() => {
    const newSize = layout.computeViewportSize(wrapperSize);
    const [, , w, h] = layout.toDomShape([0, 0, ...newSize]);
    setTimeout(() => {
      onResizeRef.current?.(newSize);
    }, 0);
    return [w, h];
  }, [wrapperSize, layout]);

  useTrackWindowResize();

  return (
    <DraggableContextProvider value={{ layout }}>
      <div ref={wrapperRef} className="viewport-wrapper" style={{ width, height }}>
        <div className="viewport" style={toSizeStyle(viewportSize)}>
          {children}
        </div>
      </div>
    </DraggableContextProvider>
  );
};

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
