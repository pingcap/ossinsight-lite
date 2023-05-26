import { GridLayoutType } from '@ossinsight-lite/layout/src/core/layout/grid';
import { Rect, Size } from '@ossinsight-lite/layout/src/core/types';

export type LayoutItem = LibraryItem & {
  rect: Rect
}

export type LibraryItem = {
  id?: string | undefined
  name: string
  props: any
}

export type ItemReference = {
  id: string
  rect: Rect
  zIndex?: number
}

export type Dashboard = {
  layout: {
    type: `gird:${GridLayoutType}`
    size: Size
    gap: number
  }
  items: ItemReference[]
}

export type LayoutConfigV0 = LayoutItem[];

export type Store = 'tidb' | 'localStorage' | 'localStorageLegacy' | 'new' | 'default';

export type SavingFlags = { error: unknown } | Partial<Record<Store, boolean>>;

export type LayoutConfigV1 = {
  version: 1
  library: LibraryItem[]
  dashboard: Record<string, Dashboard>
  libraryStore?: Store
  dashboardsStore?: Store
}
