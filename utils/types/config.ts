import { ItemReferenceLayout } from '@/utils/layout';
import { CSSProperties } from 'react';
import { Layout } from 'react-grid-layout';

export interface CustomLibraryItemProps {
}

export interface LibraryItemProps extends CustomLibraryItemProps {
  title?: string;
  className?: string;
  style?: CSSProperties;
  showBorder?: boolean;
}

export type LibraryItem = {
  id?: string | undefined
  name: string
  props: LibraryItemProps
  visibility?: 'public' | 'private'

  // admin page only
  referencedDashboards?: string[]
}

export type ItemReference = {
  id: string
  layout: ItemReferenceLayout
  zIndex?: number
}

export type Dashboard = {
  /**
   * @deprecated
   */
  layout: {
    size: [number, number]
    gap: number
  }
  items: ItemReference[]
  visibility?: string
}

export type LayoutStore = 'tidb' | 'localStorage';

export type LayoutConfigV1 = {
  version: 1 | 2
  library: LibraryItem[]
  dashboard: Record<string, Dashboard>
  libraryStore?: LayoutStore
  dashboardsStore?: LayoutStore
}
