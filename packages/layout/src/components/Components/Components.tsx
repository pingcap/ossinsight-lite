import { cloneElement, FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Rect, toShapeStyle } from '../../core/types.ts';
import { useDraggable } from '../../hooks/draggable.ts';
import clsx from 'clsx';
import './draggable.scss';
import { DraggableItemContextProvider } from '../../context/draggable-item.ts';
import { Resizer } from './resizer.tsx';

export type Item = {
  id?: string
  rect: Rect
  name: string
  props?: Record<string, any>
}

export interface ComponentsProps {
  items: Item[];
  idMap?: Map<string, string>;
  draggable?: boolean;

  render (id: string, name: string, props: Record<string, any> | undefined, draggable: boolean): ReactElement;
}

const Components: FC<ComponentsProps> = function Components ({ draggable = false, items, render, idMap }) {
  const register = useCallback((id: string, externalId: string) => {
    idMap?.set(id, externalId);
  }, [idMap]);

  const unregister = useCallback((id: string) => {
    idMap?.delete(id);
  }, [idMap]);

  return (
    <>
      {items.map(item => (
        <ComponentWrapper rect={item.rect} key={item.id ?? item.name} externalId={item.id ?? item.name} draggable={draggable} register={register} unregister={unregister}>
          {render(item.id ?? item.name, item.name, item.props, draggable)}
        </ComponentWrapper>
      ))}
    </>
  );
};

interface ComponentWrapperProps {
  externalId: string;
  rect: Rect;
  draggable: boolean;
  children: ReactElement;
  register: (id: string, externalId: string) => void;
  unregister: (id: string) => void;
}

const DRAGGING_STYLE = 'translate3d(0,0,0) translateY(-2px) scale(1.02)';

function ComponentWrapper ({ externalId, rect, draggable, register, unregister, children }: ComponentWrapperProps) {
  const [, setVersion] = useState(0);
  const {
    id,
    ref,
    shape,
    domProps,
    dragging,
    layout,
  } = useDraggable<HTMLDivElement>({
    initialShape: rect,
    notify: () => {
      setVersion(v => v + 1);
    },
  });

  const properShape = id === layout.dragging?.id ? layout.currentShape : layout.elements.get(id)?.shape ?? shape;
  const shapeStyle = toShapeStyle(layout.toDomShape(properShape));

  useEffect(() => {
    register(id, externalId);
    return () => unregister(id);
  }, [externalId, id]);

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
        {draggable && (
          <div className='resize-handles'>
            <Resizer id={id} shape={shape} position="end" type="vertical" />
            <Resizer id={id} shape={shape} position="end" type="horizontal" />
            <Resizer id={id} shape={shape} position="start" type="vertical" />
            <Resizer id={id} shape={shape} position="start" type="horizontal" />
          </div>
        )}
      </DraggableItemContextProvider>
    </div>
  );
}

export default Components;
