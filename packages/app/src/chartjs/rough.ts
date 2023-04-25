import rc from 'roughjs';
import { defaults, LineElement, plugins, Scale } from 'chart.js';

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

LineElement.prototype.draw = function (this: LineElement, ctx, area) {
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
};

const originalBeforeDatasetDraw = plugins.Filler.beforeDatasetDraw;

plugins.Filler.beforeDatasetDraw = function (chart, args, options) {
  if (args.meta.$filler && args.meta.type === 'line') {
    const c = rc.canvas(chart.canvas, {
      options: {
        fill: args.meta.dataset.options.backgroundColor,
      },
    });
    const points = args.meta.data.filter(point => !point.skip).map(point => [point.x, point.y]);
    // console.log(chart.chartArea.bottom);
    points.push([points[points.length - 1][0], chart.chartArea.bottom]);
    points.push([points[0][0], chart.chartArea.bottom]);
    points.unshift(points[0].slice());

    c.polygon(points, {
      stroke: 'transparent',
      seed: 0,
    });
    return;
  }
  return originalBeforeDatasetDraw.call(this, chart, args, options);
};

export {};
