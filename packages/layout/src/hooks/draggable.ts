import { HTMLProps, LegacyRef, MouseEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { equals, offset, Point, Rect } from '../core/types.ts';
import { useDraggableContext } from '../context/draggable.ts';
import type { Layout, ResizeOptions } from '../core/layout/base.ts';

export interface DraggableState<E extends HTMLElement> {
  id: string;
  ref: LegacyRef<E>;
  layout: Layout<any, any>;
  shape: Rect;
  draggingOffset: Point | null;
  dragging: boolean;
  domProps: Pick<HTMLProps<E>, 'onMouseDown'>;
}

export interface DraggableOption {
  initialShape?: Rect;
  resize?: ResizeOptions & { target: string };
  notify?: () => void;
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
    if (option.resize) {
      return;
    }
    const cr = ref.current!.getBoundingClientRect();
    const shape = option.initialShape ?? layout.fromDomShape([cr.left, cr.top, cr.width, cr.height]);
    layout.register({
      id,
      shape,
      notify: option.notify ?? (() => {}),
    });
    setShape(shape);
    return () => {
      layout.unregister(id);
    };
  }, [layout, !!option.resize]);

  const onStart = useCallback((event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    setDragging(true);
    setStart([event.clientX, event.clientY]);
    setCurrent([event.clientX, event.clientY]);
    if (option.resize) {
      layout.starResize(option.resize.target, option.resize);
      layout.notify(option.resize.target);
    } else {
      layout.starDrag(id);
    }
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
    const shape = option.resize ? layout.endResize() : layout.endDrag();
    if (shape) {
      setShape(shape);
      if (option.resize) {
        onDrag?.(option.resize.target, shape);
        layout.notify(option.resize.target);
      }
    }
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('mouseleave', onEnd);
  }, [onDrag, option.resize?.target]);

  const draggingOffset = useMemo(() => {
    return offset(start, current);
  }, [start, current]);

  useEffect(() => {
    if (internalProcessingRef.current) {
      return;
    }
    internalProcessingRef.current = true;
    const prevShape = layout.currentShape!;
    const shape = layout.doAction(layout.fromDomOffset(draggingOffset));
    if (shape && !equals(prevShape, shape)) {
      setShape(shape);
      if (option.resize) {
        layout.notify(option.resize.target);
      }
    }
    internalProcessingRef.current = false;
  }, [layout, draggingOffset, onDrag, option.resize?.target]);

  return {
    ref,
    layout,
    shape,
    draggingOffset,
    dragging: layout.dragging?.id === id || dragging,
    domProps: {
      onMouseDown: onStart,
    },
    id,
  };
}
