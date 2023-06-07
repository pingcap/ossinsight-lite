import { ItemReferenceLayout } from '@/utils/layout';
import { CSSProperties } from 'react';

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
  layout: ItemReferenceLayout
  zIndex?: number
}

export type Dashboard = {
  layout: {
    size: [number, number]
    gap: number
  }
  upstream?: string
  lastSyncedAt?: number
  items: ItemReference[]
  visibility?: string
}

export type Store = 'tidb';

export type LayoutConfig = {
  version: 1 | 2
  library: LibraryItem[]
  dashboard: Record<string, Dashboard>
  libraryStore?: Store
  dashboardsStore?: Store
}
