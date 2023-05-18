import { HTMLProps, LegacyRef, MouseEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { equals, offset, Point, Rect } from '../core/types';
import { useDraggableContext } from '../context/draggable';
import type { Layout, ResizeOptions } from '../core/layout/base';

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
  shape: Rect;
  onShapeChange: (shape: Rect) => void;
  resize?: ResizeOptions & { target: string };
  notify?: () => void;
}

const INITIAL_POINT: Point = [0, 0];

export function useDraggable<E extends HTMLElement> ({ shape: propShape, notify, onShapeChange, resize }: DraggableOption): DraggableState<E> {
  const { layout, onDrag } = useDraggableContext<Rect, Point>();
  const id = useId();
  const ref = useRef<E>(null);

  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(INITIAL_POINT);
  const [current, setCurrent] = useState(INITIAL_POINT);

  const internalProcessingRef = useRef(false);

  useEffect(() => {
    if (resize) {
      return;
    }
    const cr = ref.current!.getBoundingClientRect();
    const shape = propShape ?? layout.fromDomShape([cr.left, cr.top, cr.width, cr.height]);
    layout.register({
      id,
      shape,
      notify: notify ?? (() => {}),
    });
    onShapeChange(shape);
    return () => {
      layout.unregister(id);
    };
  }, [layout, !!resize, onShapeChange]);

  useEffect(() => {
    if (propShape) {
      onShapeChange(propShape);
      const element = layout.elements.get(id);
      if (element) {
        element.shape = propShape;
      }
    }
  }, [propShape, onShapeChange]);

  const onMove = useCallback((event: globalThis.MouseEvent) => {
    setCurrent([event.clientX, event.clientY]);
  }, [layout]);

  const onEnd = useCallback((_: globalThis.MouseEvent) => {
    setDragging(false);
    setStart(INITIAL_POINT);
    setCurrent(INITIAL_POINT);
    const shape = resize ? layout.endResize() : layout.endDrag();
    if (shape) {
      onShapeChange(shape);
      if (resize) {
        onDrag?.(resize.target, shape);
        layout.notify(resize.target);
      } else {
        onDrag?.(id, shape);
      }
    }
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('mouseleave', onEnd);
  }, [onDrag, resize?.target, onShapeChange]);

  const onStart = useCallback((event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    setDragging(true);
    setStart([event.clientX, event.clientY]);
    setCurrent([event.clientX, event.clientY]);
    if (resize) {
      layout.starResize(resize.target, resize);
      layout.notify(resize.target);
    } else {
      layout.starDrag(id);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('mouseleave', onEnd);
  }, [layout, onMove, onEnd]);

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
      onShapeChange?.(shape);
      if (resize) {
        layout.notify(resize.target);
      }
    }
    internalProcessingRef.current = false;
  }, [layout, draggingOffset, onDrag, resize?.target, onShapeChange]);

  return {
    ref,
    layout,
    shape: propShape,
    draggingOffset,
    dragging: layout.dragging?.id === id || dragging,
    domProps: {
      onMouseDown: onStart,
    },
    id,
  };
}
