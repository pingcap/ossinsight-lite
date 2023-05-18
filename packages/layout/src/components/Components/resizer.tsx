import clsx from 'clsx';
import HorizontalIcon from './grip-horizontal.svg';
import VerticalIcon from './grip-vertical.svg';
import { useDraggable } from '../../hooks/draggable';
import { Rect } from '../../core/types';
import { useState } from 'react';

const icons = {
  vertical: VerticalIcon,
  horizontal: HorizontalIcon,
};

export function Resizer ({ id, shape: propShape, position, type }: { id: string, shape: Rect, position: 'start' | 'end', type: 'vertical' | 'horizontal' }) {
  const [shape, setShape] = useState(propShape)
  const { ref, domProps, dragging } = useDraggable<HTMLDivElement>({
    shape,
    onShapeChange: setShape,
    resize: {
      vertical: type === 'vertical',
      start: position === 'start',
      target: id,
    },
  });
  const Icon = icons[type];
  return (
    <div className={clsx('resize-handle', position, type, { dragging })}>
      <div className="resize-handle-trigger" ref={ref} {...domProps}>
        <Icon />
      </div>
    </div>
  );
}
