import { WidgetModule } from '../../widgets-manifest';
import { forwardRef, Suspense, useCallback, useState } from 'react';
import WidgetInstance from '../../components/WidgetInstance';
import { useUpdater, useWatchItemFields } from '@oss-widgets/ui/hooks/bind';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { WidgetContextProvider } from '../../components/WidgetContext';
import { useRouter } from 'next/navigation';

export interface WidgetCoordinator {
  name: string;
  props: any;
  _id: string;
  editMode: boolean;
  draggable: boolean;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ name, _id: id, draggable, editMode, props: passInProps }, ref) => {
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
    navigate(`/edit/${encodeURIComponent(id)}`);
  }, []);

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
