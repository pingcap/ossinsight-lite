import cpm from './contributions_per_month.sql';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJs, Filler, Legend, LinearScale, LineElement, PointElement, TimeScale, TimeSeriesScale, Title, Tooltip as _Tooltip } from 'chart.js';
import React, { ForwardedRef, HTMLProps } from 'react';
import clsx from 'clsx';
import 'chartjs-adapter-luxon';
import * as colors from 'tailwindcss/colors';

import '@ossinsight-lite/roughness/chartjs';

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

export default function Widget (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div {...props} ref={ref} className={clsx(props.className, 'flex flex-col p-4 gap-4 relative font-sketch')}>
      <div className="flex-1 overflow-hidden">
        <Line
          width="100%"
          height="100%"
          data={{
            labels: ['issue', 'pull_request', 'issue_comment', 'commit_comment'],
            datasets: ['issue', 'pull_request', 'issue_comment', 'commit_comment'].map((dim, index) => ({
              data: cpm
                .filter(x => x.type === dim)
                .map(({ month, cnt }) => ({
                  x: month,
                  y: cnt,
                })),
              label: dim,
              borderColor: lineColors[index],
              borderWidth: 1,
              pointRadius: 0,
              backgroundColor: areaColors[index] + 'c0',
              fill: true,
            })),
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                axis: 'x',
                type: 'time',
                min: cpm[0].month,
                max: cpm[cpm.length - 1].month,
                time: {},
                adapters: {
                  date: {
                    locale: 'en',

                  },
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: 'Activity trends by month',
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
      </div>
    </div>
  );
}
