import { ItemReference } from '@/utils/types/config';
import { Layout, Layouts } from 'react-grid-layout';

export const breakpointNames = ['xl', 'lg', 'md', 'sm', 'xs', 'xxs'] as const;

export type BreakpointName = typeof breakpointNames[number];

export const breakpoints: Responsive<number> = { xl: 1600, lg: 1200, md: 960, sm: 768, xs: 480, xxs: 0 };
export const cols: Responsive<number> = { xl: 40, lg: 32, md: 24, sm: 16, xs: 12, xxs: 8 };

export type Responsive<T> = Record<BreakpointName, T>

const layoutShapeKeys = ['x', 'y', 'w', 'h'] as const;
const persistedLayoutKeys = ['x', 'y', 'w', 'h', 'minW', 'minH', 'maxW', 'maxH'] as const;

export type LayoutShapeKey = typeof layoutShapeKeys[number];
export type PersistedLayoutKey = typeof persistedLayoutKeys[number];

export type LayoutShape = Pick<Layout, LayoutShapeKey>
export type PersistedLayout = Pick<Layout, PersistedLayoutKey>;

export type ItemReferenceLayout = Partial<Responsive<PersistedLayout>>

export function compareLayoutShape (a: LayoutShape, b: LayoutShape) {
  let key: LayoutShapeKey;
  for (let i = 0; i < layoutShapeKeys.length; i++) {
    key = layoutShapeKeys[i];
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

export function comparePersistedLayout (a: PersistedLayout, b: PersistedLayout) {
  let key: PersistedLayoutKey;
  for (let i = 0; i < persistedLayoutKeys.length; i++) {
    key = persistedLayoutKeys[i];
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

export function extractLayoutItem (layouts: Layouts, id: string): Responsive<Layout> {
  return breakpointNames.reduce((res, breakpoint) => {
    const layout = layouts[breakpoint];
    if (layout) {
      const item = layout.find(l => l.i === id);
      if (item) {
        res[breakpoint] = item;
      }
    }
    return res;
  }, {} as Responsive<Layout>);
}


export function getFirstBreakpointValue<T> (responsive: Partial<Responsive<T>>) {
  const bp = breakpointNames.find(breakpoint => !!responsive[breakpoint]);
  if (bp) {
    return responsive[bp];
  }
}
