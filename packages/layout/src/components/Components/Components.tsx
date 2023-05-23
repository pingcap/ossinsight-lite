import { ComponentType, createRef, forwardRef, ReactElement, useEffect, useMemo, useState } from 'react';
import { Rect, toShapeStyle } from '../../core/types';
import { DraggableState, useDraggable } from '../../hooks/draggable';
import clsx from 'clsx';
import './draggable.scss';
import './transitions.scss';
import { DraggableItemContextProvider } from '../../context/draggable-item';
import { Resizer } from './resizer';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import mergeRefs from '@ossinsight-lite/ui/utils/merge-refs';

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
  draggableProps?: DraggableState<HTMLDivElement>['domProps']
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

  commonProps: (externalId: string) => Props & { wrapperClassName?: string | undefined };
}

function Components<Props extends Record<string, any>> ({ draggable = false, itemIds, idMap, onRegister, onUnregister, useRect, updateRect, Component, commonProps }: ComponentsProps<Props>) {
  const register = useRefCallback((id: string, externalId: string) => {
    idMap?.set(id, externalId);
    onRegister?.(externalId);
  });

  const refs = useMemo(() => {
    return itemIds.map(() => createRef<HTMLDivElement>());
  }, [itemIds.length]);

  const unregister = useRefCallback((id: string) => {
    const externalId = idMap?.get(id);
    idMap?.delete(id);
    if (externalId) {
      onUnregister?.(externalId);
    }
  });

  return (
    <TransitionGroup appear enter exit>
      {itemIds.map((id, index, array) => {
        const { wrapperClassName, ...rest } = commonProps(id);
        const delay = Math.random() * array.length * 50;

        return (
          <CSSTransition
            key={id}
            classNames="fade"
            timeout={400 + delay}
            nodeRef={refs[index]}
          >
            <ComponentWrapper className={wrapperClassName} externalId={id} draggable={draggable} register={register} unregister={unregister} useRect={useRect} updateRect={updateRect}>
              {(dragging, draggableProps) => (
                <div className="relative w-full h-full" ref={refs[index]} style={{ transitionDelay: `${delay}ms` }}>
                  <Component id={id} className="w-full h-full" draggable={draggable} dragging={dragging} draggableProps={draggableProps} {...rest as Props} />
                </div>
              )}
            </ComponentWrapper>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

interface ComponentWrapperProps {
  className?: string;
  externalId: string;
  draggable: boolean;
  children: (dragging: boolean, draggableProps?: DraggableState<HTMLDivElement>['domProps']) => ReactElement;
  register: (id: string, externalId: string) => void;
  unregister: (id: string) => void;
  useRect: (externalId: string) => Rect;
  updateRect: (externalId: string, rect: Rect) => void;
}

const DRAGGING_STYLE = 'translate3d(0,0,0) translateY(-2px) scale(1.02)';

const ComponentWrapper = forwardRef<HTMLDivElement, ComponentWrapperProps>(({ className, externalId, draggable, register, unregister, useRect, updateRect, children }, forwardedRef) => {
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
      ref={mergeRefs(ref, forwardedRef)}
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
    >
      <DraggableItemContextProvider shape={shape} layout={layout}>
        {children(dragging, draggable ? domProps : undefined)}
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
});

export default Components;
