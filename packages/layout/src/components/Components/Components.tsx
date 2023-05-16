import { ComponentType, ReactElement, useEffect, useMemo, useState } from 'react';
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
  dragging: boolean
}

export interface ComponentsProps<Props> {
  itemIds: string[];

  idMap?: Map<string, string>;
  draggable?: boolean;

  Component: ComponentType<ComponentProps & Props>;

  onRegister?: (externalId: string) => void;
  onUnregister?: (externalId: string) => void;

  useRect: (externalId: string) => Rect;
  updateRect: (externalId: string, rect: Rect) => void;

  wrap?: (children: ReactElement) => ReactElement;

  commonProps: (externalId: string) => Props & { wrapperClassName?: string | undefined };
}

function Components<Props extends Record<string, any>> ({ draggable = false, itemIds, idMap, onRegister, onUnregister, useRect, updateRect, Component, wrap = el => el, commonProps }: ComponentsProps<Props>) {
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

  return (
    <>
      {itemIds.map(id => {
        const { wrapperClassName, ...rest } = commonProps(id);

        return wrap(
          <ComponentWrapper key={id} className={wrapperClassName} externalId={id} draggable={draggable} register={register} unregister={unregister} useRect={useRect} updateRect={updateRect}>
            {dragging => <Component id={id} draggable={draggable} dragging={dragging} {...rest as Props} />}
          </ComponentWrapper>,
        );
      })}
    </>
  );
};

interface ComponentWrapperProps {
  className?: string;
  externalId: string;
  draggable: boolean;
  children: (dragging: boolean) => ReactElement;
  register: (id: string, externalId: string) => void;
  unregister: (id: string) => void;
  useRect: (externalId: string) => Rect;
  updateRect: (externalId: string, rect: Rect) => void;
}

const DRAGGING_STYLE = 'translate3d(0,0,0) translateY(-2px) scale(1.02)';

function ComponentWrapper ({ className, externalId, draggable, register, unregister, useRect, updateRect, children }: ComponentWrapperProps) {
  const [, setVersion] = useState(0);
  const rect = useRect(externalId);
  const onShapeChange = useMemo(() => (rect: Rect) => updateRect(externalId, rect), [externalId, updateRect]);
  const {
    id,
    ref,
    shape,
    domProps,
    dragging,
    layout,
  } = useDraggable<HTMLDivElement>({
    shape: rect,
    onShapeChange,
    notify: () => {
      setVersion(v => v + 1);
    },
  });

  const properShape = id === layout.dragging?.id ? layout.currentShape : shape;
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
      }, className)}
      style={{
        ...shapeStyle,
        transform: `${shapeStyle.transform}${dragging ? ' ' + DRAGGING_STYLE : ''}`,
        position: draggable ? undefined : 'absolute',
      }}
      {...(draggable ? domProps : undefined)}
    >
      <DraggableItemContextProvider shape={shape} layout={layout}>
        {children(dragging)}
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
