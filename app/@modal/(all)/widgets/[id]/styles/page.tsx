'use client';
import { useWatchItemFields } from '@/packages/ui/hooks/bind';
import { WidgetCoordinator } from '@/src/_pages/Dashboard/WidgetCoordinator';
import clsx from 'clsx';
import { library } from '@/app/bind';
import BackgroundColorPicker from '@/app/@modal/(all)/widgets/[id]/styles/_components/backgroundColor';
import { JustifyContentSwitch } from '@/app/@modal/(all)/widgets/[id]/styles/_components/justifyContent';
import './_components/style.scss';
import { AlignItemsSwitch } from '@/app/@modal/(all)/widgets/[id]/styles/_components/alignItems';
import { TextAlignSwitch } from '@/app/@modal/(all)/widgets/[id]/styles/_components/textAlign';

export default function Page ({ params }: any) {
  const id = decodeURIComponent(params.id);
  const { name, props } = useWatchItemFields('library', id, ['name', 'props']);

  return (
    <div>
      <div className="flex gap-2">
        <BackgroundColorPicker id={id} />
        <div className="p-2 flex flex-col gap-2">
          <TextAlignSwitch id={id} />
          <JustifyContentSwitch id={id} />
          <AlignItemsSwitch id={id} />
        </div>
      </div>
      <div className="border-b my-4" />
      <WidgetCoordinator name={name} props={{ ...props, className: clsx(props.className, 'h-[320px] rounded-lg border font-sketch') }} _id={id} editMode={false} draggable={false} />
    </div>
  );
}