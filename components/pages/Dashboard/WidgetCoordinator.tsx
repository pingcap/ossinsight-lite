'use client';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { useDataOptions } from '@/components/pages/Dashboard/dataOptions';
import WidgetContext from '@/packages/ui/context/widget';
import { useVisible } from '@/packages/ui/hooks/visible';
import mergeRefs from '@/packages/ui/utils/merge-refs';
import { useResolvedWidget } from '@/store/features/widgets';
import { useUpdater, useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { forwardRef, useContext } from 'react';

export interface WidgetCoordinator {
  name: string;
  props: any;
  _id: string;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ name, _id: id, props: passInProps }, ref) => {
  const { dashboardName } = useContext(DashboardContext);
  const widget = useResolvedWidget(name);

  const { props: watchingProps } = useWatchItemFields('library', id, ['props']);
  const updater = useUpdater('library', id);

  const props = { ...passInProps, ...watchingProps };

  const onPropChange = useRefCallback((key: string, value: any) => {
    updater((item) => {
      item.props = { ...item.props, [key]: value };
      return item;
    });
  });

  const Widget = widget.Widget;
  const { ref: visibleRef, visible } = useVisible<HTMLDivElement>();
  const dataOptions = useDataOptions(name, id);

  return (
    <WidgetContext.Provider
      value={{
        onPropChange,
        props,
        visible,
        configuring: false,
        creating: false,
        ...dataOptions,
      }}
    >
      <Widget ref={mergeRefs(ref, visibleRef)} {...props} />
    </WidgetContext.Provider>
  );
});
