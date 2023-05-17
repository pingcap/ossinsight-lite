import { Widget, WidgetModule } from '../../widgets-manifest';
import { forwardRef, Suspense, useCallback, useMemo, useState } from 'react';
import WidgetInstance from '../../components/WidgetInstance';
import { getConfigurable } from '../../utils/widgets';
import { useNavigate } from 'react-router-dom';
import { useUpdater, useWatchItemFields } from '@oss-widgets/ui/hooks/bind';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { WidgetContextProvider } from '../../components/WidgetContext';

export interface WidgetCoordinator {
  name: string;
  props: any;
  _id: string;
  editMode: boolean;
  draggable: boolean;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ name, _id: id, draggable, editMode, props: passInProps }, ref) => {
  const [module, setModule] = useState<WidgetModule>();

  const configurable = useMemo(() => {
    if (!module) return false;
    return getConfigurable(module, { ...module.defaultProps, ...passInProps });
  }, [module, passInProps]);

  const navigate = useNavigate();

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
      <Suspense fallback='Loading...'>
        <WidgetInstance name={name} onWidgetLoad={(module) => setModule(module)} ref={ref} props={props} />
      </Suspense>
    </WidgetContextProvider>
  );
})
