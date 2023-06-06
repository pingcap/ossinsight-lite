import { createContext } from 'react';

export const noDataOptions: WidgetContextDataOptionsValues = {
  requestingData: false,
  data: null,
  requestDataError: undefined,
  onRequestData: () => {},
};

export type WidgetContextValues = {
  visible: boolean,
  props: any
  configuring: boolean
  creating: boolean
  requestingData: boolean
  data: any
  requestDataError: unknown
  onPropChange: (name: any, value: any) => void
  onRequestData: (abort?: AbortController) => void;
}

export type WidgetContextDataOptionsValues = Pick<WidgetContextValues, 'data' | 'requestingData' | 'requestDataError' | 'onRequestData'>;

const WidgetContext = createContext<WidgetContextValues>({
  visible: false,
  props: {},
  configuring: false,
  creating: false,
  onPropChange: () => {},
  ...noDataOptions,
});

WidgetContext.displayName = 'WidgetContext';

export default WidgetContext;
