import { Layout } from './base';
import { move, Point, Rect, resize } from '../types';

export class PixelLayout extends Layout<Rect, Point> {
  cloneShape (shape: Rect): Rect {
    return [...shape];
  }

  protected override drag (offset: Point): false | Rect {
    if (this.dragging) {
      return this.currentShape = normalizePosition(move(this.dragging.shape, offset));
    }
    return false;
  }

  protected override resize (offset: Point): false | Rect {
    if (this.dragging) {
      return this.currentShape = normalizePosition(resize(this.dragging.shape, offset, this.resizeOptions?.start ?? false));
    }
    return false;
  }

  override fromDomShape (shape: Rect): Rect {
    return shape;
  }

  override toDomShape (shape: Rect): Rect {
    return shape;
  }

  override fromDomOffset (offset: Point): Point {
    return offset;
  }

  override toDomOffset (offset: Point): Point {
    return offset;
  }

  override prepareResizeOffset (offset: Point, vertical: boolean): Point {
    if (vertical) {
      return [offset[0], 0];
    } else {
      return [0, offset[1]];
    }
  }
}

function normalize (x: number) {
  return Math.round(x / 50) * 50;
}

function normalizePosition<T extends Point | Rect> (p: T) {
  p = [...p];
  p[0] = normalize(p[0]);
  p[1] = normalize(p[1]);
  return p;
}
