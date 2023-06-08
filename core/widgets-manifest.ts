/// IMPORTANT:
/// This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest

import { ButtonHTMLAttributes, ComponentType, CSSProperties, ForwardRefExoticComponent, HTMLProps } from 'react';

type Widgets = Record<string, WidgetModule>
type WidgetModuleMeta<P = any> = {
  /** @deprecated */
  preferredSize?: CSSProperties,
  defaultProps?: Partial<P>,
  duplicable?: boolean,
  styleConfigurable?: boolean,
  /** @deprecated */
  configurablePropsOverwrite?: Partial<P>,
  /** @deprecated */
  widgetListItemPropsOverwrite?: Partial<P>,

  createPngThumbnail?: () => Promise<{ default: (server: ServerContext, props: P, ctx: CanvasRenderingContext2D, width: number, height: number) => void | Promise<void> }>,

  getData?: () => Promise<{ default (server: ServerContext, props: P): Promise<any> }>,

  category?: string
  displayName?: string
}

export type ServerContext = {
  runSql (db: string, sql: string): Promise<{ data: any[], columns: { name: string, type: number }[] }>;
}

type WidgetModule<P = any> = {
  Widget: () => Promise<{ default: ForwardRefExoticComponent<P & HTMLProps<HTMLDivElement>> }>
  WidgetDetails?: () => Promise<{ default: ForwardRefExoticComponent<P & HTMLProps<HTMLDivElement>> }>
  ConfigureComponent?: () => Promise<{ default: ForwardRefExoticComponent<P & HTMLProps<HTMLDivElement>> }>
  /** @deprecated */
  NewButton?: () => Promise<{ default: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>> }>
  Icon?: () => Promise<{ default: ComponentType }>
} & WidgetModuleMeta<P>

type ResolvedWidgetModule<P = any> = {
  name: string
  Widget: ComponentType<P & HTMLProps<HTMLDivElement>>
  WidgetDetails?: ComponentType<P & HTMLProps<HTMLDivElement>>
  ConfigureComponent?: ComponentType<P & HTMLProps<HTMLDivElement>>
  /** @deprecated */
  NewButton?: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>
  Icon?: ComponentType
} & WidgetModuleMeta<P> & {
  category: string
  displayName: string
}

export default {} as Widgets;

export type {
  Widgets,
  WidgetModule,
  WidgetModuleMeta,
  ResolvedWidgetModule,
};

throw new Error('This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest. Check your config.');
