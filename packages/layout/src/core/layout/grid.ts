import { move, Point, Rect, resize, Size } from '../types';
import { Layout } from './base';

export const enum GridLayoutType {
  RESPONSIVE = 'responsive',
  FIX_SIZE = 'fix-size',
}

export type GridLayoutOptions = {
  columns?: Size;
  type?: GridLayoutType;
  gridSize?: Size;
  gap?: number;
}

export class GridLayout extends Layout<Rect, Point> {
  type: GridLayoutType;
  gridSize: Size;
  gap: number;
  columns: Size;

  private _viewportSize: Size = [0, 0];

  constructor ({ type = GridLayoutType.RESPONSIVE, gridSize = [40, 40], gap = 8, columns = [40, 16] }: GridLayoutOptions) {
    super();
    this.type = type;
    this.gridSize = gridSize;
    this.gap = gap;
    this.columns = columns;
  }

  override computeViewportSize (size: Size): Size {
    switch (this.type) {
      case GridLayoutType.FIX_SIZE:
        return this._viewportSize = [
          floorEven(Math.floor((size[0] - this.gridSize[0]) / (this.gap + this.gridSize[1])) + 1),
          floorEven(Math.floor((size[1] - this.gridSize[0]) / (this.gap + this.gridSize[1])) + 1),
        ];
      case GridLayoutType.RESPONSIVE:
        this.gridSize = [(size[0] - this.gap * (this.columns[0] + 1)) / this.columns[0], (size[1] - this.gap * (this.columns[1] + 1)) / this.columns[1]];
        return this._viewportSize = this.columns;
    }
  }

  override cloneShape (shape: Rect): Rect {
    return [...shape];
  }

  override fromDomShape (shape: Rect): Rect {
    return [
      round(shape[0], this.gridSize[0], this.gap) - this._viewportSize[0] / 2,
      round(shape[1], this.gridSize[1], this.gap) - this._viewportSize[1] / 2,
      round(shape[2], this.gridSize[0], this.gap),
      round(shape[3], this.gridSize[1], this.gap),
    ];
  }

  override toDomShape (shape: Rect): Rect {
    return [
      (shape[0] + this._viewportSize[0] / 2) * (this.gridSize[0] + this.gap),
      (shape[1] + this._viewportSize[1] / 2) * (this.gridSize[1] + this.gap),
      shape[2] * (this.gridSize[0] + this.gap) - this.gap,
      shape[3] * (this.gridSize[1] + this.gap) - this.gap,
    ];
  }

  override fromDomOffset (offset: Point): Point {
    return [
      Math.round(offset[0] / (this.gridSize[0] + this.gap)),
      Math.round(offset[1] / (this.gridSize[1] + this.gap)),
    ];
  }

  override toDomOffset (offset: Point): Point {
    return [
      offset[0] * (this.gridSize[0] + this.gap),
      offset[1] * (this.gridSize[1] + this.gap),
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
