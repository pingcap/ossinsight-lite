import { cloneElement, FC, ReactElement, useEffect, useState } from 'react';
import { Rect, toShapeStyle } from '../../core/types.ts';
import { useDraggable } from '../../hooks/draggable.ts';
import clsx from 'clsx';
import './draggable.scss';
import { DraggableItemContextProvider } from '../../context/draggable-item.ts';
import { Resizer } from './resizer.tsx';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback.ts';

export type Item = {
  id?: string
  rect: Rect
  name: string
  props?: Record<string, any>
}

export interface ComponentProps {
  id: string,
  draggable: boolean
}

export interface ComponentsProps {
  itemIds: string[];

  idMap?: Map<string, string>;
  draggable?: boolean;

  children (props: ComponentProps): ReactElement | null;

  onRegister?: (externalId: string) => void;
  onUnregister?: (externalId: string) => void;

  useRect: (externalId: string) => Rect;
}

const Components: FC<ComponentsProps> = function Components ({ draggable = false, itemIds, idMap, onRegister, onUnregister, useRect, children }) {
  const register = useRefCallback((id: string, externalId: string) => {
    idMap?.set(id, externalId);
    onRegister?.(externalId);
  });

  const unregister = useRefCallback((id: string) => {
    const externalId = idMap?.get(id);
    idMap?.delete(id);
    if (externalId) {
      onUnregister?.(externalId);
    }
  });

  const Children = children;

  return (
    <>
      {itemIds.map(id => (
        <ComponentWrapper key={id} externalId={id} draggable={draggable} register={register} unregister={unregister} useRect={useRect}>
          <Children id={id} draggable={draggable} />
        </ComponentWrapper>
      ))}
    </>
  );
};

interface ComponentWrapperProps {
  externalId: string;
  draggable: boolean;
  children: ReactElement;
  register: (id: string, externalId: string) => void;
  unregister: (id: string) => void;
  useRect: (externalId: string) => Rect;
}

const DRAGGING_STYLE = 'translate3d(0,0,0) translateY(-2px) scale(1.02)';

function ComponentWrapper ({ externalId, draggable, register, unregister, useRect, children }: ComponentWrapperProps) {
  const [, setVersion] = useState(0);
  const rect = useRect(externalId);
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
        'draggable-target': true,
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
        {children}
        {draggable && (
          <div className="resize-handles">
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
