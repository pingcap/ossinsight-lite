/// IMPORTANT:
/// This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest

import { Rect } from '@/packages/layout/src/core/types';
import { ButtonHTMLAttributes, ComponentType, CSSProperties, ForwardRefExoticComponent, HTMLProps } from 'react';

type Widgets = Record<string, WidgetModule>
type WidgetModuleMeta<P = any> = {
  /** @deprecated */
  preferredSize?: CSSProperties,
  defaultRect?: Rect;
  defaultProps?: Partial<P>,
  duplicable?: boolean,
  styleConfigurable?: boolean,
  /** @deprecated */
  styleFlexLayout?: 'col' | 'row',
  /** @deprecated */
  configurablePropsOverwrite?: Partial<P>,
  /** @deprecated */
  widgetListItemPropsOverwrite?: Partial<P>,

  category?: string
  displayName?: string
}

type WidgetModule<P = any> = {
  Widget: () => Promise<{ default: ForwardRefExoticComponent<P & HTMLProps<HTMLDivElement>> }>,
  ConfigureComponent?: () => Promise<{ default: ForwardRefExoticComponent<P & HTMLProps<HTMLDivElement>> }>
  NewButton?: () => Promise<{ default: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>> }>
} & WidgetModuleMeta<P>

type ResolvedWidgetModule<P = any> = {
  name: string
  Widget: ComponentType<P & HTMLProps<HTMLDivElement>>
  ConfigureComponent?: ComponentType<P & HTMLProps<HTMLDivElement>>
  NewButton?: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>
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
