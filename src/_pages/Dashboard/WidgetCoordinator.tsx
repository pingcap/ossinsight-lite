import { WidgetModule } from '../../widgets-manifest';
import { forwardRef, Suspense, useCallback, useContext, useState } from 'react';
import WidgetInstance from '../../components/WidgetInstance';
import { useUpdater, useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { WidgetContextProvider } from '../../components/WidgetContext';
import { useRouter } from 'next/navigation';
import { DashboardContext } from '@/src/_pages/Dashboard/context';

export interface WidgetCoordinator {
  name: string;
  props: any;
  _id: string;
  editMode: boolean;
  draggable: boolean;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ name, _id: id, draggable, editMode, props: passInProps }, ref) => {
  const { dashboardName } = useContext(DashboardContext);
  const [module, setModule] = useState<WidgetModule>();

  // TODO: Configurable
  const configurable = false;

  const router = useRouter()
  const navigate = useCallback((target: string) => {
    // TODO: typing?
    router.push(target as any);
  }, []);

  const { props: watchingProps } = useWatchItemFields('library', id, ['props']);
  const updater = useUpdater('library', id);

  const props = { ...passInProps, ...watchingProps };

  const configureAction = useCallback(() => {
    const escapedId = encodeURIComponent(id);
    if (dashboardName) {
      navigate(`/dashboards/${dashboardName}/edit/widgets/${escapedId}`)
    } else {
      navigate(`/edit/${escapedId}`);
    }
  }, [dashboardName]);

  const onPropChange = useRefCallback((key: string, value: any) => {
    updater((item) => {
      item.props = { ...item.props, [key]: value };
      return item;
    });
  });

  return (
    <WidgetContextProvider
      value={{
        enabled: true,
        editingLayout: editMode,
        configurable,
        onPropChange,
        props,
        configure: configureAction,
      }}
    >
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }>
        <WidgetInstance name={name} ref={ref} props={props} />
      </Suspense>
    </WidgetContextProvider>
  );
});
