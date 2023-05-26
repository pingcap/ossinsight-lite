import { ChartDataset } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import 'chartjs-adapter-luxon';
import * as colors from 'tailwindcss/colors';
import { Axis } from '../common';

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

export type XYData = { x: number, y: number }[];

export function getXYData (data: any[], x: Axis, y: Axis) {
  return data
    .map((item) => ({
      x: item[x.field] as number,
      y: item[y.field] as number,
    }));
}

const barDatasetOptions = {
  borderColor: lineColors[0],
  borderWidth: 1,
  backgroundColor: areaColors[0] + 'c0',
} satisfies DeepPartial<ChartDataset<'bar', XYData>>;

const lineDatasetOptions = {
  ...barDatasetOptions,
  pointRadius: 0,
  fill: true,
} satisfies DeepPartial<ChartDataset<'line', XYData>>;

export function lineDataset (data: any[], x: Axis, y: Axis) {
  return {
    data: getXYData(data, x, y),
    label: [x, y].filter(axis => axis.type === 'value')?.[0]?.label,
    ...lineDatasetOptions,
  } satisfies DeepPartial<ChartDataset<'line', XYData>>;
}

export function barDataset (data: any[], x: Axis, y: Axis) {
  return {
    data: getXYData(data, x, y),
    label: [x, y].filter(axis => axis.type === 'value')?.[0]?.label,
    ...barDatasetOptions,
  } satisfies DeepPartial<ChartDataset<'bar', XYData>>;
}
