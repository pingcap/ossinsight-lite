export type Point = [x: number, y: number];
export type Size = [w: number, h: number];
export type Rect = [...Point, ...Size];

export function isPointLike (x: unknown) {
  if (x && x instanceof Array) {
    return x.length === 2 &&
      (typeof x[0] === 'number') &&
      (typeof x[1] === 'number');
  }
  return false;
}

export const isSizeLike = isPointLike;

export function isRectLike (x: unknown) {
  if (x && x instanceof Array) {
    return x.length === 4 &&
      (typeof x[0] === 'number') &&
      (typeof x[1] === 'number') &&
      (typeof x[2] === 'number') &&
      (typeof x[3] === 'number');
  }
  return false;
}

export function move<T extends Point | Rect> (target: T, by: Point): T {
  target = [...target];
  target[0] += by[0];
  target[1] += by[1];
  return target;
}

export function offset<T extends Point | Rect> (from: T, to: T): Point {
  return [to[0] - from[0], to[1] - from[1]];
}

export function resize (rect: Rect, offset: Point, start: boolean): Rect {
  rect = [...rect];
  if (start) {
    rect[0] += offset[0];
    rect[1] += offset[1];
    rect[2] -= offset[0];
    rect[3] -= offset[1];
  } else {
    rect[2] += offset[0];
    rect[3] += offset[1];
  }
  return rect;
}

export function equals<T extends Point | Rect> (a: T, b: T) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export function toSizeStyle (t: Size) {
  return {
    width: t[0],
    height: t[1],
  };
}

export function toShapeStyle (t: Point | Rect) {
  if (t.length === 2) {
    return {
      transform: `translate3d(${t[0]}px, ${t[1]}px, 0)`,
    };
  } else {
    return {
      transform: `translate3d(${t[0]}px, ${t[1]}px, 0)`,
      width: t[2],
      height: t[3],
    };
  }
}
