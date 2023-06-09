'use client';
import { useDataOptions } from '@/components/pages/Dashboard/dataOptions';
import WidgetContext from '@/packages/ui/context/widget';
import mergeRefs from '@/packages/ui/utils/merge-refs';
import { useLibraryItemField, useUpdateLibraryItem } from '@/store/features/library';
import { useResolvedWidget } from '@/store/features/widgets';
import { useVisible } from '@/utils/visible';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { forwardRef } from 'react';

export interface WidgetCoordinator {
  name: string;
  props: any;
  _id: string;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ name, _id: id, props: passInProps }, ref) => {
  const widget = useResolvedWidget(name);

  const { showBorder, ...watchingProps } = useLibraryItemField(id, item => item.props);
  const updateLibraryItem = useUpdateLibraryItem();

  const props = { ...passInProps, ...watchingProps };

  const onPropChange = useRefCallback((key: string, value: any) => {
    updateLibraryItem(id, (item) => {
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
