import { ChartData, ChartOptions } from 'chart.js';
import * as colors from 'tailwindcss/colors';
import cpm from './contributions_per_month.sql';

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

export const data = {
  labels: ['issue', 'pull_request', 'issue_comment', 'commit_comment'],
  datasets: ['issue', 'pull_request', 'issue_comment', 'commit_comment'].map((dim, index) => ({
    type: 'line',
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
} satisfies ChartData;

export const options = {
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
} satisfies ChartOptions;