import { createContext } from 'react';

export type WidgetContextValues = {
  visible: boolean,
  props: any
  configuring: boolean
  creating: boolean
  onPropChange: (name: any, value: any) => void
}

const WidgetContext = createContext<WidgetContextValues>({
  visible: false,
  props: {},
  configuring: false,
  creating: false,
  onPropChange: () => {},
});

WidgetContext.displayName = 'WidgetContext';

export default WidgetContext;
