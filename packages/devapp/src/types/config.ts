import { Rect } from '@oss-widgets/layout/src/core/types';

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
    type: 'grid'
    size: number
    gap: number
  }
  items: ItemReference[]
}

export type LayoutConfigV0 = LayoutItem[];

export type LayoutConfigV1 = {
  version: 1
  library: LibraryItem[]
  dashboard: Record<'default', Dashboard>
}
