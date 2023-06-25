import { Chart as ChartJs, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import { ServerContext } from '../../../../../../core/widgets-manifest';
import { getCartesianScaleOption } from '../../../components/visualize/chartjs/getCartesianScaleOption';
import { barDataset } from '../../../components/visualize/chartjs/getXYData';
import { legendsPlugin } from '../../../components/visualize/chartjs/legendsPlugin';
import { titlePlugin } from '../../../components/visualize/chartjs/titlePlugin';
import { WidgetProps } from './Widget';

ChartJs.register(
  ...registerables,
);

export default async function (server: ServerContext, props: WidgetProps, ctx: CanvasRenderingContext2D) {
  if (props.visualize.type === 'table') {
    throw new Error(`Rendering table to PNG is not support yet`);
  }

  if (props.visualize.type === 'gauge') {
    throw new Error(`Rendering gauge to PNG is not support yet`);
  }

  const { data } = await server.runSql(props.currentDb, props.sql);

  const { title } = props;
  const { x, y } = props.visualize;

  if (props.visualize.type === 'chart:bar') {
    new ChartJs(ctx, {
      data: { datasets: [{ type: 'bar', ...barDataset(data, x, y) }] },
      options: {
        animation: false,
        maintainAspectRatio: false,
        indexAxis: (['x', 'y'] as const)[[x, y].findIndex(axis => axis.type !== 'value') ?? 0] ?? 'x',
        scales: {
          x: getCartesianScaleOption(data, x, 'x'),
          y: getCartesianScaleOption(data, y, 'y'),
        },
        plugins: {
          title: titlePlugin(title),
          legend: legendsPlugin(),
        },
      },
    });
  } else {
    new ChartJs(ctx, {
      data: { datasets: [{ type: 'line', ...barDataset(data, x, y) }] },
      options: {
        animation: false,
        maintainAspectRatio: false,
        scales: {
          x: getCartesianScaleOption(data, x, 'x'),
          y: getCartesianScaleOption(data, y, 'y'),
        },
        plugins: {
          title: titlePlugin(title),
          legend: legendsPlugin(),
        },
      },
    });
  }
}
