import { ResolvedWidgetModule } from '../../widgets-manifest';
import { forwardRef, useContext, useMemo, useState } from 'react';
import WidgetInstance from '../../components/WidgetInstance';
import { useUpdater, useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { WidgetContextProvider } from '../../components/WidgetContext';
import { usePathname } from 'next/navigation';
import { DashboardContext } from '@/src/_pages/Dashboard/context';
import { getConfigurable } from '@/src/utils/widgets';

export interface WidgetCoordinator {
  name: string;
  props: any;
  _id: string;
  editMode: boolean;
  draggable: boolean;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ name, _id: id, draggable, editMode, props: passInProps }, ref) => {
  const { dashboardName } = useContext(DashboardContext);

  // TODO: Configurable
  const [configurable, setConfigurable] = useState(false);

  const pathname = usePathname();

  const { props: watchingProps } = useWatchItemFields('library', id, ['props']);
  const updater = useUpdater('library', id);

  const props = { ...passInProps, ...watchingProps };

  const configureHref = useMemo(() => {
    const escapedId = encodeURIComponent(id);
    if (!pathname) {
      return '';
    }
    return `/widgets/${escapedId}/edit`;
  }, [pathname]);

  const onPropChange = useRefCallback((key: string, value: any) => {
    updater((item) => {
      item.props = { ...item.props, [key]: value };
      return item;
    });
  });

  const onModuleLoad = useRefCallback((module: ResolvedWidgetModule) => {
    setConfigurable(getConfigurable(module, props));
  });

  return (
    <WidgetContextProvider
      value={{
        enabled: true,
        editingLayout: editMode,
        configurable,
        onPropChange,
        props,
        configure: configureHref,
        configuring: false,
      }}
    >
      <WidgetInstance name={name} ref={ref} props={props} configuring={false} onLoad={onModuleLoad} />
    </WidgetContextProvider>
  );
});
