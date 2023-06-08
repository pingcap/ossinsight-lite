import { WidgetCoordinator } from '@/components/pages/Dashboard/WidgetCoordinator';
import Border from '@/components/pages/modal/widgets/styles/border';
import { useWatchItemFields } from '@/packages/ui/hooks/bind';
import clsx from 'clsx';
import { horizontal, vertical } from './alignIcons';
import { AlignItemsSwitch } from './alignItems';
import BackgroundColorPicker from './backgroundColor';
import { JustifyContentSwitch } from './justifyContent';
import './style.scss';
import { TextAlignSwitch } from './textAlign';

export default function StyleEditor ({ id }: { id: string }) {
  const { name, props } = useWatchItemFields('library', id, ['name', 'props']);

  return (
    <div>
      <div className="flex gap-2">
        <BackgroundColorPicker id={id} />
        <div className="p-2 flex flex-col gap-2">
          <Border id={id} />
          <TextAlignSwitch id={id} />
          <JustifyContentSwitch title={'Horizontal Align'} icons={horizontal} id={id} />
          <AlignItemsSwitch title={'Vertical Align'} icons={vertical} id={id} />
        </div>
      </div>
      <div className="border-b my-4" />
      <WidgetCoordinator name={name} props={{ ...props, className: clsx(props.className, 'h-[320px] rounded-lg border font-sketch') }} _id={id} />
    </div>
  );
}