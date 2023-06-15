import { useConfirm } from '@/components/ConfirmDialog';
import { EditingLayer } from '@/components/pages/Dashboard/EditingLayer';
import WidgetPreview from '@/components/WidgetPreview';
import LoadingIndicator from '@/packages/ui/components/loading-indicator/Icon';
import dashboards from '@/store/features/dashboards';
import library from '@/store/features/library';
import { useWidget } from '@/store/features/widgets';
import { LibraryItem } from '@/utils/types/config';
import TrashIcon from 'bootstrap-icons/icons/trash.svg';
import { Suspense, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function Item ({ item: { name, id, props: { showBorder, ...props }, referencedDashboards = [] } }: { item: LibraryItem }) {
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const widget = useWidget(name);

  const deleteLibraryItem = useCallback((id: string) => {
    confirm({
      title: (
        <h2 className="text-lg text-primary mb-4">
          {'Are you sure you want to '}
          <span className="text-red-600 font-bold capitalize">
            delete
          </span>
          {' this widget?'}
        </h2>
      ),
      description: (
        <div>
          <p className="text-sm text-secondary mb-2">
            {referencedDashboards?.length === 0
              ? 'This widget has not been applied to any dashboard.'
              : <>This widget has been applied to the [{referencedDashboards?.map((d, i) => [<b key={d}>{d}</b>, i > 0 ? ', ' : '']) ?? 'UNKNOWN'}] dashboard, and the panel will be affected after deletion.</>}
          </p>
          <p className="text-xs text-yellow-500 mb-2">
            ⚠️ The operation is not recoverable.
          </p>
        </div>
      ),
      confirmText: 'I got it, delete it please.',
    }).then((confirmed) => {
      if (confirmed) {
        dispatch(dashboards.actions.deleteLibraryItems({ id }));
        dispatch(library.actions.delete({ id }));
      }
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteLibraryItem(id);
  }, []);

  return (
    <li className="border border-gray bg-white rounded text-gray-700 flex flex-col gap-4 p-2" key={name}>
      <div className="h-[239px] flex flex-col justify-stretch overflow-hidden">
        <div className="widget-wrapper">
          <EditingLayer
            id={id ?? name}
            movable={false}
            deletable={widget.deletable !== false}
            onDelete={() => handleDelete(id ?? name)}
            DeleteIcon={TrashIcon}
          />
          <Suspense fallback={<div className="w-full h-full flex justify-center items-center gap-2"><LoadingIndicator /> Loading widget...</div>}>
            <WidgetPreview
              className="font-sketch"
              id={id}
              name={name}
              props={props}
            />
          </Suspense>
        </div>
      </div>
    </li>
  );
}