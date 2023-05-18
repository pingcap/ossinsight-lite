import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { useContext } from 'react';

export const WidgetContextProvider = WidgetContext.Provider;

export function useWidgetContext () {
  return useContext(WidgetContext);
}
