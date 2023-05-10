import { Rect, Size } from '../types.ts';

enum Action {
  DRAG,
  RESIZE,
}

export type ResizeOptions = {
  start: boolean
  vertical: boolean
}

export abstract class Layout<Shape, Offset> {
  elements = new Map<string, DraggableElement<Shape>>();
  dragging: DraggableElement<Shape> | null = null;
  placeholder: DraggableElement<Shape> | null = null;
  currentShape: Shape | null = null;
  action: Action | null = null;
  resizeOptions: ResizeOptions | null = null;

  register (el: DraggableElement<Shape>) {
    this.elements.set(el.id, el);
  }

  unregister (id: string) {
    this.elements.delete(id);
  }

  computeViewportSize (size: Size): Size {
    return size;
  }

  private startAction (id: string, action: Action) {
    const el = this.elements.get(id);
    if (el) {
      this.elements.delete(id);
      this.placeholder = this.clone(el);
      this.dragging = el;
      this.currentShape = this.cloneShape(el.shape);
      this.action = action;
      if (typeof window !== 'undefined') {
        window.document.body.style.userSelect = 'none';
      }
    }
  }

  private endAction (action: Action) {
    if (this.action !== action) {
      throw new Error('Bad state');
    }
    const el = this.dragging;
    if (el) {
      el.shape = this.currentShape ?? el.shape;
      this.elements.set(el.id, el);
      this.dragging = null;
      this.placeholder = null;
      this.currentShape = null;
      if (typeof window !== 'undefined') {
        window.document.body.style.userSelect = '';
      }
      this.action = null;
      return this.cloneShape(el.shape);
    }
    return null;
  }

  starDrag (id: string) {
    this.startAction(id, Action.DRAG);
  }

  endDrag (): Shape | null {
    return this.endAction(Action.DRAG);
  }

  starResize (id: string, options: ResizeOptions) {
    this.startAction(id, Action.RESIZE);
    this.resizeOptions = options;
  }

  endResize (): Shape | null {
    const result = this.endAction(Action.RESIZE);
    this.resizeOptions = null;
    return result;
  }

  protected abstract drag (offset: Offset): false | Shape;

  protected abstract resize (offset: Offset): false | Shape;

  doAction (offset: Offset): false | Shape {
    switch (this.action) {
      case Action.RESIZE:
        return this.resize(this.prepareResizeOffset(offset, this.resizeOptions!.vertical));
      case Action.DRAG:
        return this.drag(offset);
    }
    return false;
  }

  clone (el: DraggableElement<Shape>): DraggableElement<Shape> {
    return { ...el, shape: this.cloneShape(el.shape) };
  }

  normalizeDomShape (shape: Rect): Rect {
    return this.toDomShape(this.fromDomShape(shape));
  }

  notify (id: string) {
    if (id === this.dragging?.id) {
      this.dragging.notify();
    } else {
      this.elements.get(id)?.notify();
    }
  }

  abstract cloneShape (shape: Shape): Shape;

  abstract fromDomShape (shape: Rect): Shape;

  abstract toDomShape (shape: Shape): Rect;

  abstract fromDomOffset (offset: Offset): Offset;

  abstract toDomOffset (offset: Offset): Offset;

  abstract prepareResizeOffset (offset: Offset, vertical: boolean): Offset;
}

export interface DraggableElement<Shape> {
  id: string;
  shape: Shape;
  notify: () => void;
}

export type DraggableRectElement = DraggableElement<Rect>
