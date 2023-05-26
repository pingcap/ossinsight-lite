import { BarElement, defaults, LineElement, plugins, Scale } from 'chart.js';
import type BarElementType from 'chart.js/dist/elements/element.bar';
import type LineElementType from 'chart.js/dist/elements/element.line';
import rc from 'roughjs';

defaults.font.family = 'CabinSketch';
defaults.scale.grid.display = false;

Scale.prototype.drawGrid = function (chartArea) {
  // MARK: must call this to prevent chartjs draw default lines
  this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));

  const c = rc.canvas(this.chart.canvas, {
    options: {
      stroke: 'black',
    },
  });
  c.line(chartArea.left, chartArea.bottom, chartArea.right, chartArea.bottom);
  c.line(chartArea.left, chartArea.top, chartArea.left, chartArea.bottom);
};

LineElement.prototype.draw = function (this: LineElementType, ctx) {
  const c = rc.canvas(ctx.canvas, {
    options: {
      stroke: this.options.borderColor as string,
    },
  });
  const points = this.points.slice();

  let lastPoint = points[0];

  for (const point of points.slice(1)) {
    c.line(lastPoint.x, lastPoint.y, point.x, point.y, { seed: 0 });
    lastPoint = point;
  }

  if (this.animated) {
    this._pointsUpdated = false;
    this._path = undefined;
  }
};

BarElement.prototype.draw = function (this: BarElementType, ctx) {
  const c = rc.canvas(ctx.canvas, {
    options: {
      stroke: this.options.borderColor as string,
      fill: this.options.backgroundColor as string,
    },
  });

  const getBarBounds = (bar: typeof this, useFinalPosition: boolean) => {
    const { x, y, base, width, height } = bar.getProps([
      'x',
      'y',
      'base',
      'width',
      'height',
    ], useFinalPosition);
    let left: number, right: number, top: number, bottom: number, half: number;
    if (bar.horizontal) {
      half = height / 2;
      left = Math.min(x, base);
      right = Math.max(x, base);
      top = y - half;
      bottom = y + half;
    } else {
      half = width / 2;
      left = x - half;
      right = x + half;
      top = Math.min(y, base);
      bottom = Math.max(y, base);
    }
    return {
      left,
      top,
      right,
      bottom,
    };
  };

  const { left, top, right, bottom } = getBarBounds(this, false);

  let path: [number, number][];
  if (this.horizontal) {
    path = [
      [left, top],
      [right, top],
      [right, bottom],
      [left, bottom],
    ];
  } else {
    path = [
      [left, bottom],
      [left, top],
      [right, top],
      [right, bottom],
    ];
  }
  c.linearPath(path);
  c.polygon(path, {
    stroke: 'none',
  });
};

const originalBeforeDatasetDraw = plugins.Filler.beforeDatasetDraw;

plugins.Filler.beforeDatasetDraw = function (chart, args, options) {
  if (!args.meta?.$filler) {
    return originalBeforeDatasetDraw.call(this, chart, args, options);
  }

  switch (args.meta.type) {
    case 'line': {
      const c = rc.canvas(chart.canvas, {
        options: {
          fill: args.meta.dataset.options.backgroundColor,
        },
      });
      const points = args.meta.data.filter(point => !point.skip).map(point => [point.x, point.y]);
      if (points.length === 0) {
        return;
      }
      // console.log(chart.chartArea.bottom);
      points.push([points[points.length - 1][0], chart.chartArea.bottom]);
      points.push([points[0][0], chart.chartArea.bottom]);
      points.unshift(points[0].slice());

      c.polygon(points, {
        stroke: 'none',
        seed: 0,
      });
      return;
    }
    default:
      return originalBeforeDatasetDraw.call(this, chart, args, options);
  }
};

export {};
