import { Rect, Size } from '../types.ts';

export abstract class Layout<Shape, Offset> {
  elements = new Map<string, DraggableElement<Shape>>();
  dragging: DraggableElement<Shape> | null = null;
  placeholder: DraggableElement<Shape> | null = null;
  currentShape: Shape | null = null;

  register (el: DraggableElement<Shape>) {
    this.elements.set(el.id, el);
  }

  unregister (id: string) {
    this.elements.delete(id);
  }

  computeViewportSize (size: Size): Size {
    return size;
  }

  starDrag (id: string) {
    const el = this.elements.get(id);
    if (el) {
      this.elements.delete(id);
      this.placeholder = this.clone(el);
      this.dragging = el;
      this.currentShape = this.cloneShape(el.shape);
      if (typeof window !== 'undefined') {
        window.document.body.style.userSelect = 'none';
      }
    }
  }

  endDrag (): Shape | null {
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
      return this.cloneShape(el.shape);
    }
    return null;
  }

  abstract drag (offset: Offset): false | Shape;

  clone (el: DraggableElement<Shape>): DraggableElement<Shape> {
    return { ...el, shape: this.cloneShape(el.shape) };
  }

  normalizeDomShape (shape: Rect): Rect {
    return this.toDomShape(this.fromDomShape(shape));
  }

  abstract cloneShape (shape: Shape): Shape;

  abstract fromDomShape (shape: Rect): Shape;

  abstract toDomShape (shape: Shape): Rect;

  abstract fromDomOffset (offset: Offset): Offset;

  abstract toDomOffset (offset: Offset): Offset;
}

export interface DraggableElement<Shape> {
  id: string;
  shape: Shape;
}

export type DraggableRectElement = DraggableElement<Rect>
