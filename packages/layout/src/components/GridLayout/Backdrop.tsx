import { CSSProperties, FC } from 'react';
import { GridLayoutOptions, GridLayoutType } from '../../core/layout/grid.ts';
import { Point, Size } from '../../core/types.ts';

interface BackdropProps extends GridLayoutOptions {
  size: Size;
  gap: number;
}

const Backdrop: FC<Required<BackdropProps>> = function Backdrop ({ type, columns, gridSize, gap, size: viewportSize }) {
  let size: Size
  switch (type) {
    case GridLayoutType.FIX_SIZE:
      size = columns;
      break;
    case GridLayoutType.RESPONSIVE:
      size = viewportSize;
      break;
  }

  return (
    <div className='absolute left-1 top-1'>
      {gridSize} {gap} {size.toString()}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="guide-point" width={8} height={8} viewBox="0 0 8 8" stroke="white">
          <path d="M0,4 H8 M4,0 V8" />
        </symbol>
      </svg>
      <div className="guide-ui">
        {array2(size, point => (
          <div key={point.toString()} style={getGuildPointStyle(point, gridSize, gap)}>
            <svg width={8} height={8}>
              <use href="#guide-point" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Backdrop;

function array2<T> (size: Size, map: (point: Point) => T): Iterable<T> {
  return {
    [Symbol.iterator] () {
      const curr: Point = [0, 0];

      return {
        next () {
          if (curr[0] >= size[0]) {
            return {
              value: null,
              done: true,
            };
          }
          const el = map(curr);
          curr[1]++;
          if (curr[1] >= size[1]) {
            curr[1] = 0;
            curr[0]++;
          }

          return {
            value: el,
          };
        },
      } satisfies Iterator<T>;
    },
  };
}

function getGuildPointStyle (point: Point, gridSize: Size, gap: number): CSSProperties {
  return {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: point[0] * (gridSize[0] + gap),
    top: point[1] * (gridSize[1] + gap),
    width: gridSize[0],
    height: gridSize[1],
  };
}
