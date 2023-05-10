import { ComponentType, CSSProperties, ForwardedRef, HTMLProps } from 'react';

type Widgets = Record<string, Widget>
type WidgetModule = {
  default: (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => JSX.Element,
  preferredSize?: CSSProperties,
  defaultProps?: Record<string, any>,
  configurable?: boolean,
  configurablePropsOverwrite?: Record<string, any>,
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
};
