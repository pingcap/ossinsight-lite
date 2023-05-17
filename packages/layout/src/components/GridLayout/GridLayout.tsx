import { forwardRef, ReactNode, useMemo, useState } from 'react';
import Viewport, { ViewportProps } from '../Viewport';
import { useLayout } from '../../hooks/layout.ts';
import { GridLayout as LayoutManager, GridLayoutOptions } from '../../core/layout/grid.ts';
import Backdrop from './Backdrop.tsx';
import { Size } from '../../core/types.ts';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback.ts';

const INITIAL_SIZE: Size = [0, 0];

export interface GridLayoutProps extends GridLayoutOptions, Pick<ViewportProps, 'onDrag' | 'className'> {
  children?: ReactNode;
  guideUi?: boolean;
}

const GridLayout = forwardRef<HTMLDivElement, GridLayoutProps>(function GridLayout ({ guideUi = false, gridSize: propGridSize = [40, 40], columns = [40, 16], gap = 8, children, ...props }, ref) {
  const layout = useLayout(
    LayoutManager,
    useMemo(() => ({ gridSize, gap }), [propGridSize[0], propGridSize[1], gap]),
  ) as LayoutManager;

  const [viewportSize, setViewportSize] = useState<Size>(INITIAL_SIZE);
  const [gridSize, setGridSize] = useState<Size>(INITIAL_SIZE);

  const handleResize = useRefCallback((viewPortSize: Size) => {
    setViewportSize(viewPortSize);
    setGridSize(layout.gridSize);
  });

  return (
    <Viewport layout={layout} onResize={handleResize} ref={ref} {...props}>
      {guideUi && <Backdrop type={layout.type} gridSize={gridSize} gap={gap} columns={columns} size={viewportSize} />}
      {children}
    </Viewport>
  );
});

export default GridLayout;
