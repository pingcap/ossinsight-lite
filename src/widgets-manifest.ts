/// IMPORTANT:
/// This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest

import { CSSProperties, ForwardedRef, ForwardRefExoticComponent, HTMLProps } from 'react';

type Widgets = Record<string, Widget>
type WidgetModuleMeta<P = any> = {
  preferredSize?: CSSProperties,
  defaultProps?: Partial<P>,
  configurable?: boolean | ((props: any) => boolean),
  styleConfigurable?: boolean | ((props: any) => boolean),
  configurablePropsOverwrite?: Partial<P>,
  widgetListItemPropsOverwrite?: Partial<P>,
}

type WidgetModule<P = any> = {
  default: (props: P & HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => JSX.Element,
} & WidgetModuleMeta<P>
type ResolvedWidgetModule<P = any> = {
  default: ForwardRefExoticComponent<P & HTMLProps<HTMLDivElement>>
} & WidgetModuleMeta<P>

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
