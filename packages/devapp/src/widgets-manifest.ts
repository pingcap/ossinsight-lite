import { ComponentType, CSSProperties, HTMLProps } from 'react';

type Widgets = Record<string, Widget>
type WidgetModule = { default: ComponentType<HTMLProps<HTMLDivElement>>, preferredSize?: CSSProperties }
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
