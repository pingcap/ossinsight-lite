/// IMPORTANT:
/// This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest

import { Rect } from '@/packages/layout/src/core/types';
import { CSSProperties, ForwardedRef, ForwardRefExoticComponent, HTMLProps } from 'react';

type Widgets = Record<string, Widget>
type WidgetModuleMeta<P = any> = {
  /** @deprecated */
  preferredSize?: CSSProperties,
  defaultRect?: Rect;
  defaultProps?: Partial<P>,
  duplicable?: boolean,
  configureComponent?: () => Promise<{ default: (props: P & HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => JSX.Element }>
  styleConfigurable?: boolean | ((props: any) => boolean),
  /** @deprecated */
  configurablePropsOverwrite?: Partial<P>,
  /** @deprecated */
  widgetListItemPropsOverwrite?: Partial<P>,

  category?: string
  displayName?: string
}

type WidgetModule<P = any> = {
  default: (props: P & HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => JSX.Element,
} & WidgetModuleMeta<P>
type ResolvedWidgetModule<P = any> = {
  default: ForwardRefExoticComponent<P & HTMLProps<HTMLDivElement>>
} & WidgetModuleMeta<P> & {
  category: string
  displayName: string
}

type Widget = {
  module: () => Promise<WidgetModule>
  source: string
  cssSource: string | undefined
}

export default {} as Widgets;

export type {
  Widget,
  Widgets,
  WidgetModule,
  WidgetModuleMeta,
  ResolvedWidgetModule,
};

throw new Error('This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest. Check your config.');
