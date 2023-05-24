import { TitleOptions } from 'chart.js';

export function titlePlugin (text: string | undefined): Partial<TitleOptions> {
  return {
    text,
    display: !!text,
    position: 'top',
  };
}