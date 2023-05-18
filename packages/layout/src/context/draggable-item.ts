import { createContext, createElement, PropsWithChildren, useContext } from 'react';
import type { Layout } from '../core/layout/base';
import { PixelLayout } from '../core/layout/pixel';

export interface DraggableItemValues<Shape, Offset> {
  layout: Layout<Shape, Offset>;
  shape: any;
}

const DraggableItemContext = createContext<DraggableItemValues<any, any>>({
  layout: new PixelLayout(),
  shape: null,
});

export const DraggableItemContextProvider = <Shape, Offset> ({ children, shape, layout }: PropsWithChildren<DraggableItemValues<Shape, Offset>>) => {
  return createElement(DraggableItemContext.Provider, {
    value: { shape, layout },
    children,
  });
};

export const useDraggableItemContext = <Shape, Offset> () => useContext<DraggableItemValues<Shape, Offset>>(DraggableItemContext);
