import { CartesianScaleOptions, CartesianScaleTypeRegistry, ScaleOptionsByType, TimeScaleOptions, TimeUnit } from 'chart.js/dist/types';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { Axis } from '../common';

export function getCartesianScaleOption (data: any[], config: Axis, axis: CartesianScaleOptions['axis']): DeepPartial<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>> & { type: keyof CartesianScaleTypeRegistry } {
  let type: ScaleOptionsByType<keyof CartesianScaleTypeRegistry>['type'];
  let unit: TimeUnit | undefined;

  switch (config.type) {
    case 'category':
      type = 'category';
      break;
    case 'value':
      type = 'linear';
      break;
    case 'datetime':
      type = 'time';
      break;
    case 'day':
      type = 'time';
      unit = 'day';
      break;
    case 'month':
      type = 'time';
      unit = 'month';
      break;
    case 'year':
      type = 'time';
      unit = 'year';
      break;
  }

  const common: DeepPartial<Omit<CartesianScaleOptions, 'min' | 'max'>> & { type: keyof CartesianScaleTypeRegistry } = {
    axis,
    type,
    title: {
      display: !!config.label && config.type !== 'value',
      text: config.label,
    },
    ticks: {
      display: data.length > 0,
    },
  };

  if (axis === 'y' && config.type === 'category') {
    if (common.ticks) {
      common.ticks.mirror = true;
    }
  }

  switch (type) {
    case 'time':
      return {
        ...common,
        time: {
          minUnit: unit,
        },
        adapters: {
          date: {
            locale: 'en',
          },
        },
      } satisfies DeepPartial<TimeScaleOptions> & { type: string };
  }

  return common;
}