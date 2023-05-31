import { Chart as ChartJs } from 'chart.js';
import { ServerContext } from '../../../../../../core/widgets-manifest';
import { getCartesianScaleOption } from '../../../components/visualize/chartjs/getCartesianScaleOption';
import { barDataset } from '../../../components/visualize/chartjs/getXYData';
import { legendsPlugin } from '../../../components/visualize/chartjs/legendsPlugin';
import { titlePlugin } from '../../../components/visualize/chartjs/titlePlugin';
import { WidgetProps } from './Widget';

export default async function (server: ServerContext, props: WidgetProps, ctx: CanvasRenderingContext2D) {
  if (props.visualize.type !== 'chart:bar') {
    throw new Error(`${props.visualize.type} not support yet`);
  }

  const data = await server.runSql(props.currentDb, props.sql);

  const { x, y, title } = props.visualize;

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
}
