import { FC, ReactNode, useMemo, useState } from 'react';
import Viewport, { ViewportProps } from '../Viewport';
import { useLayout } from '../../hooks/layout.ts';
import { GridLayout as LayoutManager, GridLayoutOptions } from '../../core/layout/grid.ts';
import Backdrop from './Backdrop.tsx';
import { Size } from '../../core/types.ts';

const INITIAL_SIZE: Size = [0, 0];

export interface GridLayoutProps extends GridLayoutOptions, Pick<ViewportProps, 'width' | 'height' | 'onDrag'> {
  children?: ReactNode
  guideUi?: boolean
}

const GridLayout: FC<GridLayoutProps> = function GridLayout ({ guideUi = false, gridSize, gap = 8, children, ...props }) {
  const layout = useLayout(
    LayoutManager,
    useMemo(() => ({ gridSize, gap }), [gridSize, gap]),
  );

  const [viewportSize, setViewportSize] = useState<Size>(INITIAL_SIZE);

  return (
    <Viewport layout={layout} onResize={setViewportSize} {...props}>
      {guideUi && <Backdrop gridSize={gridSize} gap={gap} size={viewportSize} />}
      {children}
    </Viewport>
  );
};

export default GridLayout;
