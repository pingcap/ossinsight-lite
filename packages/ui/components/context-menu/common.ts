import { MouseEvent } from 'react';

export const stopPropagation = (event: MouseEvent) => {
  event.stopPropagation();
};