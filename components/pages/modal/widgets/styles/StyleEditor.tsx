import { WidgetCoordinator } from '@/components/pages/Dashboard/WidgetCoordinator';
import Border from '@/components/pages/modal/widgets/styles/border';
import { ConfigurableStyle } from '@/core/widgets-manifest';
import { useWatchItemFields } from '@/packages/ui/hooks/bind';
import { useWidget } from '@/store/features/widgets';
import clsx from 'clsx';
import { useMemo } from 'react';
import { horizontal, vertical } from './alignIcons';
import { AlignItemsSwitch } from './alignItems';
import BackgroundColorPicker from './backgroundColor';
import { JustifyContentSwitch } from './justifyContent';
import './style.scss';
import { TextAlignSwitch } from './textAlign';

type ConfigurableStyles = Partial<Record<ConfigurableStyle, true>>;

export default function StyleEditor ({ id }: { id: string }) {
  const { name, props } = useWatchItemFields('library', id, ['name', 'props']);
  const widget = useWidget(name);
  const configurableStyles: ConfigurableStyles = useMemo(() => {
    const styleConfigurable = widget.styleConfigurable;
    if (!styleConfigurable) {
      return {
        'backgroundColor': true,
        'justifyContent': true,
        'alignItems': true,
        'textAlign': true,
        'showBorder': true,
      };
    } else {
      return styleConfigurable.reduce((res, key) => {
        res[key] = true;
        return res;
      }, {} as ConfigurableStyles);
    }
  }, [widget]);

  return (
    <div>
      <div className="flex gap-2">
        {configurableStyles.backgroundColor && <BackgroundColorPicker id={id} />}
        <div className="p-2 flex flex-col gap-2">
          {configurableStyles.showBorder && <Border id={id} />}
          {configurableStyles.textAlign && <TextAlignSwitch id={id} />}
          {configurableStyles.justifyContent && <JustifyContentSwitch title={'Horizontal Align'} icons={horizontal} id={id} />}
          {configurableStyles.alignItems && <AlignItemsSwitch title={'Vertical Align'} icons={vertical} id={id} />}
        </div>
      </div>
      <div className="border-b my-4" />
      <WidgetCoordinator name={name} props={{ ...props, className: clsx(props.className, 'h-[320px] rounded-lg border font-sketch') }} _id={id} />
    </div>
  );
}