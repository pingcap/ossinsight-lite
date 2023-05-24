import { ResolvedWidgetModule } from '../../widgets-manifest';
import { forwardRef, useEffect, useRef, useState } from 'react';
import WidgetInstance from '../../components/WidgetInstance';
import { useUpdater, useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { WidgetContextProvider } from '../../components/WidgetContext';
import { getConfigurable, getStyleConfigurable } from '@/src/utils/widgets';
import PaletteIcon from '@/src/icons/palette.svg';
import PencilIcon from '@/src/icons/pencil.svg';
import { MenuItem } from '@/packages/ui/components/menu';
import { usePathname } from 'next/navigation';

export interface WidgetCoordinator {
  name: string;
  props: any;
  _id: string;
  editMode: boolean;
  draggable: boolean;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ name, _id: id, draggable, editMode, props: passInProps }, ref) => {
  const mountedRef = useRef(true);
  const [styleConfigurable, setStyleConfigurable] = useState(false);
  const [configurable, setConfigurable] = useState(false);

  const pathname = usePathname();
  const { props: watchingProps } = useWatchItemFields('library', id, ['props']);
  const updater = useUpdater('library', id);

  const props = { ...passInProps, ...watchingProps };

  const onPropChange = useRefCallback((key: string, value: any) => {
    updater((item) => {
      item.props = { ...item.props, [key]: value };
      return item;
    });
  });

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onModuleLoad = useRefCallback((module: ResolvedWidgetModule) => {
    if (mountedRef.current) {
      setConfigurable(getConfigurable(module, props));
      setStyleConfigurable(getStyleConfigurable(module, props));
    }
  });

  return (
    <WidgetContextProvider
      value={{
        enabled: true,
        editingLayout: editMode,
        configurable,
        onPropChange,
        props,
        configuring: false,
      }}
    >
      <WidgetInstance name={name} ref={ref} props={props} configuring={false} onLoad={onModuleLoad} />
      {styleConfigurable && (
        <MenuItem id="styles" text={<PaletteIcon />} href={`/widgets/${encodeURIComponent(id)}/styles`} order={99} />
      )}
      {configurable && (
        <MenuItem id="configure" text={<PencilIcon fill="currentColor" />} href={`/widgets/${encodeURIComponent(id)}/edit`} order={1} disabled={!configurable} />
      )}
    </WidgetContextProvider>
  );
});
