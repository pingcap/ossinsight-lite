import { VisualizeLineChart, VisualizeRuntimeProps } from './common';
import { Line } from 'react-chartjs-2';
import React, { useMemo } from 'react';
import * as colors from 'tailwindcss/colors';
import { prerenderMode } from '@oss-widgets/runtime';
import { CategoryScale, Chart as ChartJs, Filler, Legend, LinearScale, LineElement, PointElement, TimeScale, TimeSeriesScale, Title, Tooltip as _Tooltip } from 'chart.js';
import '@oss-widgets/roughness/chartjs';
import 'chartjs-adapter-luxon';

const { cyan, green, red, yellow } = colors;

const lineColors = [
  red['500'],
  green['500'],
  yellow['500'],
  cyan['500'],
];

const areaColors = [
  red['200'],
  green['200'],
  yellow['200'],
  cyan['200'],
];

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
    <Line
      width="100%"
      height="100%"
      data={{
        labels: ['issue', 'pull_request', 'issue_comment', 'commit_comment'],
        datasets: data.length > 0 ? [{
          data: data
            .map((item) => ({
              x: item[x.field],
              y: item[y.field],
            })),
          label: y.label,
          borderColor: lineColors[0],
          borderWidth: 1,
          pointRadius: 0,
          backgroundColor: areaColors[0] + 'c0',
          fill: true,
        }] : [],
      }}
      options={{
        animation: prerenderMode ? false : undefined,
        maintainAspectRatio: false,
        scales: data.length > 0 ? {
          x: {
            axis: 'x',
            type: 'time',
            title: {
              display: !!x.label,
              text: x.label,
            },
            min: data[0]?.[x.field],
            max: data[data.length - 1]?.[x.field],
            time: {},
            adapters: {
              date: {
                locale: 'en',
              },
            },
          },
          y: {
            axis: 'y',
            type: 'linear',
            title: {
              display: !!y.label,
              text: y.label
            }
          }
        } : {},
        plugins: {
          title: {
            display: !!title,
            text: title,
            position: 'top',
          },
          legend: {
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxHeight: 4,
              boxPadding: 0,
              textAlign: 'left',
            },
          },
        },
      }}
    />
  );
}
