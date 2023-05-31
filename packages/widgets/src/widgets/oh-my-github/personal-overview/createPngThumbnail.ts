import { Chart as ChartJs, registerables } from 'chart.js';
import { data, options } from './chart-options';

ChartJs.register(
  ...registerables,
);

export default async function (server: {}, props: {}, ctx: CanvasRenderingContext2D) {
  new ChartJs(ctx, {
    data: data,
    options: { animation: false, ...options },
  });
}
