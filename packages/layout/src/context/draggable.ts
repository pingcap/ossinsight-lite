import { createContext, useContext } from 'react';
import { Layout } from '../core/layout/base';
import { PixelLayout } from '../core/layout/pixel';
import { Size } from '../core/types';

export interface DraggableContextValues<Shape, Offset> {
  layout: Layout<Shape, Offset>;
  onDrag?: (id: string, rect: Shape) => void;
  viewportSize: Size;
}

const DraggableContext = createContext<DraggableContextValues<any, any>>({
  layout: new PixelLayout(),
  viewportSize: [0, 0],
});

export const DraggableContextProvider = DraggableContext.Provider;

export function useDraggableContext<Shape, Offset> () {
  return useContext(DraggableContext) as DraggableContextValues<Shape, Offset>;
}
