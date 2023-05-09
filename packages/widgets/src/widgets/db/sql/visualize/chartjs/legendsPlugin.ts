import { LegendOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';

export function legendsPlugin (): DeepPartial<LegendOptions<any>> {
  return {
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      boxHeight: 4,
      boxPadding: 0,
      textAlign: 'left',
    },
  };
}