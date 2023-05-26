import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { forwardRef, ReactNode, useMemo, useState } from 'react';
import { GridLayout as LayoutManager, GridLayoutOptions } from '../../core/layout/grid';
import { Size } from '../../core/types';
import { useLayout } from '../../hooks/layout';
import Viewport, { ViewportProps } from '../Viewport';
import Backdrop from './Backdrop';

const INITIAL_SIZE: Size = [0, 0];

export interface GridLayoutProps extends GridLayoutOptions, Pick<ViewportProps, 'onDrag' | 'className'> {
  children?: ReactNode;
  guideUi?: boolean;
}

const GridLayout = forwardRef<HTMLDivElement, GridLayoutProps>(function GridLayout ({ guideUi = false, gridSize: propGridSize = [40, 40], columns = [40, 16], gap = 8, children, ...props }, ref) {
  const [viewportSize, setViewportSize] = useState<Size>(INITIAL_SIZE);
  const [gridSize, setGridSize] = useState<Size>(INITIAL_SIZE);

  const layout = useLayout(
    LayoutManager,
    useMemo(() => ({ gridSize, gap }), [propGridSize[0], propGridSize[1], gap]),
  ) as LayoutManager;

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
