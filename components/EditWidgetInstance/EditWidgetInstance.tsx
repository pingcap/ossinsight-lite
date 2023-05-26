'use client';
import { widgets } from '@/core/bind-client';
import { readItem } from '@/packages/ui/hooks/bind';
import { useVisible } from '@/packages/ui/hooks/visible';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import clsx from 'clsx';

export interface EditWidgetInstanceProps {
  name: string;
  props: any;
  onPropsChange: (key: string, value: any) => void;
  creating?: boolean;
}

export default function EditWidgetInstance ({ name, props, onPropsChange, creating = false }: EditWidgetInstanceProps) {
  const widget = readItem(widgets, name).current;
  const Widget = widget.ConfigureComponent;
  if (!Widget) {
    throw new Error(`Widget ${widget.displayName} is not configurable.`);
  }
  const { ref: visibleRef, visible } = useVisible<HTMLDivElement>();

  return (
    <WidgetContext.Provider
      value={{
        configuring: true,
        visible,
        creating,
        onPropChange: onPropsChange,
        props: { ...props, ...widget.configurablePropsOverwrite },
      }}
    >
      <Widget
        {...props}
        {...widget.configurablePropsOverwrite}
        className={clsx('w-full h-full', widget.configurablePropsOverwrite?.className, props.className)}
        ref={visibleRef}
      />
    </WidgetContext.Provider>
  );
}

