import { Layout } from './base.ts';
import { move, Point, Rect, resize, Size } from '../types.ts';

export type GridLayoutOptions = {
  gridSize: number;
  gap?: number;
}

export class GridLayout extends Layout<Rect, Point> {
  gridSize: number;
  gap: number;

  private _viewportSize: Size = [0, 0];

  constructor ({ gridSize, gap = 0 }: GridLayoutOptions) {
    super();
    this.gridSize = gridSize;
    this.gap = gap;
  }

  override computeViewportSize (size: Size): Size {
    return this._viewportSize = [
      floorEven(Math.floor((size[0] - this.gridSize) / (this.gap + this.gridSize)) + 1),
      floorEven(Math.floor((size[1] - this.gridSize) / (this.gap + this.gridSize)) + 1),
    ];
  }

  override cloneShape (shape: Rect): Rect {
    return [...shape];
  }

  protected override drag (offset: Point): false | Rect {
    if (this.dragging) {
      return this.currentShape = move(this.dragging.shape, offset);
    }
    return false;
  }

  protected override resize (offset: Point): false | Rect {
    if (this.dragging) {
      return this.currentShape = resize(this.dragging.shape, offset, this.resizeOptions!.start);
    }
    return false;
  }

  override fromDomShape (shape: Rect): Rect {
    return [
      round(shape[0], this.gridSize, this.gap) - this._viewportSize[0] / 2,
      round(shape[1], this.gridSize, this.gap) - this._viewportSize[1] / 2,
      round(shape[2], this.gridSize, this.gap),
      round(shape[3], this.gridSize, this.gap),
    ];
  }

  override toDomShape (shape: Rect): Rect {
    return [
      (shape[0] + this._viewportSize[0] / 2) * (this.gridSize + this.gap),
      (shape[1] + this._viewportSize[1] / 2) * (this.gridSize + this.gap),
      shape[2] * (this.gridSize + this.gap) - this.gap,
      shape[3] * (this.gridSize + this.gap) - this.gap,
    ];
  }

  override fromDomOffset (offset: Point): Point {
    return [
      Math.round(offset[0] / (this.gridSize + this.gap)),
      Math.round(offset[1] / (this.gridSize + this.gap)),
    ];
  }

  override toDomOffset (offset: Point): Point {
    return [
      offset[0] * (this.gridSize + this.gap),
      offset[1] * (this.gridSize + this.gap),
    ];
  }

  updateOptions (_: GridLayoutOptions) {
  }

  override prepareResizeOffset (offset: Point, vertical: boolean): Point {
    if (vertical) {
      return [offset[0], 0];
    } else {
      return [0, offset[1]];
    }
  }
}

function round (value: number, step: number, gap: number) {
  const n = Math.floor(value / (step + gap));
  const lowBoundSize = n * (step + gap) - gap;
  const upBoundSize = lowBoundSize + gap + step;

  if (upBoundSize - value > lowBoundSize - value) {
    return n + 1;
  } else {
    return n;
  }
}

function floorEven (n: number) {
  if (n % 2 === 1) {
    return n - 1;
  } else {
    return n;
  }
}
