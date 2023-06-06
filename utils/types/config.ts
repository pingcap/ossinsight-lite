import { GridLayoutType } from '@ossinsight-lite/layout/src/core/layout/grid';
import { Rect, Size } from '@ossinsight-lite/layout/src/core/types';
import { CSSProperties } from 'react';

export type LayoutItem = LibraryItem & {
  rect: Rect
}

export interface CustomLibraryItemProps {
}

export interface LibraryItemProps extends CustomLibraryItemProps {
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export type LibraryItem = {
  id?: string | undefined
  name: string
  props: LibraryItemProps
  visibility?: 'public' | 'private'
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
  visibility?: string
}

export type Store = 'tidb';

export type LayoutConfigV1 = {
  version: 1
  library: LibraryItem[]
  dashboard: Record<string, Dashboard>
  libraryStore?: Store
  dashboardsStore?: Store
}
