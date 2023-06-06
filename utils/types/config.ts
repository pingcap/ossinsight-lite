import { CSSProperties } from 'react';
import { Layout } from 'react-grid-layout';

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
  layout: { [p: string]: Pick<Layout, 'x' | 'y' | 'w' | 'h' | 'minW' | 'minH' | 'maxW' | 'maxH'> }
  zIndex?: number
}

export type Dashboard = {
  layout: {
    size: [number, number]
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
