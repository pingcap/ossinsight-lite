import { HTMLProps, LegacyRef, MouseEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { offset, Point, Rect } from '../core/types.ts';
import { useDraggableContext } from '../context/draggable.ts';
import type { Layout } from '../core/layout/base.ts';

export interface DraggableState<E extends HTMLElement> {
  id: string;
  ref: LegacyRef<E>;
  layout: Layout<any, any>
  shape: Rect;
  draggingOffset: Point | null;
  dragging: boolean;
  domProps: Pick<HTMLProps<E>,
    'onTouchStart' |
    'onTouchEnd' |
    'onTouchMove' |
    'onMouseDown' |
    'onMouseUp' |
    'onMouseMove' |
    'onMouseEnter' |
    'onMouseLeave'
  >;
}

export interface DraggableOption {
  initialShape?: Rect;
}

const INITIAL_POINT: Point = [0, 0];
const INITIAL_SHAPE: Rect = [0, 0, 100, 100];

export function useDraggable<E extends HTMLElement> (option: DraggableOption = {}): DraggableState<E> {
  const { layout, onDrag } = useDraggableContext<Rect, Point>();
  const id = useId();
  const ref = useRef<E>(null);
  const [shape, setShape] = useState(() => option.initialShape ? option.initialShape : INITIAL_SHAPE);

  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(INITIAL_POINT);
  const [current, setCurrent] = useState(INITIAL_POINT);

  const internalProcessingRef = useRef(false);

  useEffect(() => {
    const cr = ref.current!.getBoundingClientRect();
    const shape = option.initialShape ?? layout.fromDomShape([cr.left, cr.top, cr.width, cr.height]);
    layout.register({
      id,
      shape,
    });
    setShape(shape);
    return () => {
      layout.unregister(id);
    };
  }, [layout]);

  const onStart = useCallback((event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }
    setDragging(true);
    setStart([event.clientX, event.clientY]);
    setCurrent([event.clientX, event.clientY]);
    layout.starDrag(id);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('mouseleave', onEnd);
  }, [layout]);

  const onMove = useCallback((event: globalThis.MouseEvent) => {
    setCurrent([event.clientX, event.clientY]);
  }, [layout]);

  const onEnd = useCallback((_: globalThis.MouseEvent) => {
    setDragging(false);
    setStart(INITIAL_POINT);
    setCurrent(INITIAL_POINT);
    const shape = layout.endDrag();
    if (shape) {
      setShape(shape);
      onDrag?.(id, shape);
    }
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('mouseleave', onEnd);
  }, [onDrag]);

  const draggingOffset = useMemo(() => {
    return offset(start, current);
  }, [start, current]);

  useEffect(() => {
    if (internalProcessingRef.current) {
      return;
    }
    internalProcessingRef.current = true;
    const shape = layout.drag(layout.fromDomOffset(draggingOffset));
    if (shape) {
      setShape(shape);
    }
    internalProcessingRef.current = false;
  }, [layout, draggingOffset]);

  return {
    ref,
    layout,
    shape,
    draggingOffset,
    dragging,
    domProps: {
      onMouseDown: onStart,
    },
    id,
  };
}
