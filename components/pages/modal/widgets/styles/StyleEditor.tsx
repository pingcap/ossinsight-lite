import { WidgetCoordinator } from '@/components/pages/Dashboard/WidgetCoordinator';
import { widgets } from '@/core/bind-client';
import { readItem, useWatchItemFields } from '@/packages/ui/hooks/bind';
import clsx from 'clsx';
import { horizontal, vertical } from './alignIcons';
import { AlignItemsSwitch } from './alignItems';
import BackgroundColorPicker from './backgroundColor';
import { JustifyContentSwitch } from './justifyContent';
import './style.scss';
import { TextAlignSwitch } from './textAlign';

export default function StyleEditor ({ id }: { id: string }) {
  const { name, props } = useWatchItemFields('library', id, ['name', 'props']);
  const widget = readItem(widgets, name);
  const isFlexCol = widget.current.styleFlexLayout === 'col';

  return (
    <div>
      <div className="flex gap-2">
        <BackgroundColorPicker id={id} />
        <div className="p-2 flex flex-col gap-2">
          <TextAlignSwitch id={id} />
          <JustifyContentSwitch title={isFlexCol ? 'Vertical Align' : 'Horizontal Align'} icons={isFlexCol ? vertical : horizontal} id={id} />
          <AlignItemsSwitch title={isFlexCol ? 'Horizontal Align' : 'Vertical Align'} icons={isFlexCol ? horizontal : vertical} id={id} />
        </div>
      </div>
      <div className="border-b my-4" />
      <WidgetCoordinator name={name} props={{ ...props, className: clsx(props.className, 'h-[320px] rounded-lg border font-sketch') }} _id={id} editMode={false} />
    </div>
  );
}