import { createContext, useContext } from 'react';
import { Layout } from '../core/layout/base.ts';
import { PixelLayout } from '../core/layout/pixel.ts';

export interface DraggableContextValues<Shape, Offset> {
  layout: Layout<Shape, Offset>;
  onDrag?: (id: string, rect: Shape) => void;
}

const DraggableContext = createContext<DraggableContextValues<any, any>>({
  layout: new PixelLayout(),
});

export const DraggableContextProvider = DraggableContext.Provider;

export function useDraggableContext<Shape, Offset> () {
  return useContext(DraggableContext) as DraggableContextValues<Shape, Offset>;
}
