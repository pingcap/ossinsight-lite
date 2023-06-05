import { CategoryScale, Chart as ChartJs, Filler, Legend, LinearScale, LineElement, PointElement, TimeScale, TimeSeriesScale, Title, Tooltip as _Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { getCartesianScaleOption } from './chartjs/getCartesianScaleOption';
import { lineDataset } from './chartjs/getXYData';
import { legendsPlugin } from './chartjs/legendsPlugin';
import { titlePlugin } from './chartjs/titlePlugin';
import { VisualizeLineChart, VisualizeRuntimeProps } from './common';

ChartJs.register(
  TimeScale,
  TimeSeriesScale,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  _Tooltip,
  Legend,
  Filler,
);

export default function LineChartVisualize ({ result, running, title, x, y }: VisualizeLineChart & VisualizeRuntimeProps) {
  const data = useMemo(() => {
    return result?.data ?? [];
  }, [result?.data]);
  return (
    <Line<{ x: number, y: number }[]>
      width="100%"
      height="100%"
      data={{
        datasets: [lineDataset(data, x, y)],
      }}
      options={{
        maintainAspectRatio: false,
        scales: {
          x: getCartesianScaleOption(data, x, 'x'),
          y: getCartesianScaleOption(data, y, 'y'),
        },
        plugins: {
          title: titlePlugin(title),
          legend: legendsPlugin(),
        },
      }}
    />
  );
}
