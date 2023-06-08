import { widgets } from '@/core/bind-client';
import { readItem } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useVisible } from '@/packages/ui/hooks/visible';
import { LibraryItemProps } from '@/utils/types/config';
import WidgetContext, { noDataOptions } from '@ossinsight-lite/ui/context/widget';
import clsx from 'clsx';
import { ChangeEvent } from 'react';

export interface EditWidgetInstanceProps {
  name: string;
  props: any;
  onPropsChange: (key: keyof LibraryItemProps, value: any) => void;
  creating?: boolean;
  disableTitle?: boolean;
}

export default function EditWidgetInstance ({ name, props, onPropsChange, creating = false, disableTitle = false }: EditWidgetInstanceProps) {
  const widget = readItem(widgets, name).current;
  const Widget = widget.ConfigureComponent;
  if (!Widget) {
    throw new Error(`Widget ${widget.displayName} is not configurable.`);
  }
  const { ref: visibleRef, visible } = useVisible<HTMLDivElement>();

  const handleTitleChange = useRefCallback((event: ChangeEvent<HTMLInputElement>) => {
    onPropsChange('title', event.target.value);
  });

  return (
    <WidgetContext.Provider
      value={{
        configuring: true,
        visible,
        creating,
        onPropChange: onPropsChange,
        props: { ...props, ...widget.configurablePropsOverwrite },
        ...noDataOptions,
      }}
    >
      <div className="w-full h-full">
        {!disableTitle && <div className="mb-[8px]">
          <input
            className="text-input text-input-underline w-full"
            placeholder="Input a title"
            value={props.title ?? ''}
            onChange={handleTitleChange}
          />
        </div>}
        <Widget
          {...props}
          {...widget.configurablePropsOverwrite}
          className={clsx('w-full', disableTitle ? 'h-full' : 'h-[calc(100%-40px)]', widget.configurablePropsOverwrite?.className, props.className)}
          ref={visibleRef}
        />
      </div>
    </WidgetContext.Provider>
  );
}

