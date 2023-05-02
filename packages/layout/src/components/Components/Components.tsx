import { cloneElement, FC, ReactElement } from 'react';
import { Rect, toShapeStyle } from '../../core/types.ts';
import { useDraggable } from '../../hooks/draggable.ts';
import clsx from 'clsx';
import './draggable.scss';
import { DraggableItemContextProvider } from '../../context/draggable-item.ts';

export type Item = {
  id?: string
  rect: Rect
  name: string
  props?: Record<string, any>
}

export interface ComponentsProps {
  items: Item[];
  draggable?: boolean;

  render (name: string, props?: Record<string, any>): ReactElement;
}

const Components: FC<ComponentsProps> = function Components ({ draggable = false, items, render }) {
  return (
    <>
      {items.map(item => (
        <ComponentWrapper rect={item.rect} key={item.id ?? item.name} draggable={draggable}>
          {render(item.name, item.props)}
        </ComponentWrapper>
      ))}
    </>
  );
};

interface ComponentWrapperProps {
  rect: Rect;
  draggable: boolean;
  children: ReactElement;
}

const DRAGGING_STYLE = 'translate3d(0,0,0) translateY(-2px) scale(1.02)';

function ComponentWrapper ({ rect, draggable, children }: ComponentWrapperProps) {
  const {
    ref,
    shape,
    domProps,
    dragging,
    layout,
  } = useDraggable<HTMLDivElement>({
    initialShape: rect,
  });

  const shapeStyle = toShapeStyle(layout.toDomShape(shape));

  return (
    <div
      ref={ref}
      className={clsx({
        draggable,
        dragging,
      })}
      style={{
        ...shapeStyle,
        transform: `${shapeStyle.transform}${dragging ? ' ' + DRAGGING_STYLE : ''}`,
        position: draggable ? undefined : 'absolute',
      }}
      {...(draggable ? domProps : undefined)}
    >
      <DraggableItemContextProvider shape={shape} layout={layout}>
        {cloneElement(children, {
          style: {
            width: '100%',
            height: '100%',
          },
        })}
      </DraggableItemContextProvider>
    </div>
  );
}

export default Components;
