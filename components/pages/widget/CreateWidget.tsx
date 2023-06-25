'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import EditWidgetInstance from '@/components/EditWidgetInstance';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useAddDashboardItem } from '@/store/features/dashboards';
import { useAddLibraryItem } from '@/store/features/library';
import { useResolvedWidget } from '@/store/features/widgets';
import { deepCloneJson } from '@/utils/common';
import { useCallback, useContext, useState } from 'react';

export interface CreateWidgetProps {
  name: string;
}

export default function CreateWidget ({ name }: CreateWidgetProps) {
  const addLibraryItem = useAddLibraryItem();
  const addDashboardItem = useAddDashboardItem();
  const widget = useResolvedWidget(name);
  const { closeModal, useCompactMode } = useContext(ModalContext);

  useCompactMode(!name.startsWith('db/sql') && name !== 'markdown');

  const [{ showBorder, ...props }, setProps] = useState(() => {
    return deepCloneJson({ ...widget.defaultProps });
  });

  const handlePropsChange = useCallback((key: string, value: any) => {
    setProps(props => ({ ...props, [key]: value }));
  }, []);

  const handleSave = useRefCallback(() => {
    const id = `${name}-${Date.now()}`;
    addLibraryItem({
      id,
      name,
      props,
    });
    addDashboardItem({
      id,
      layout: {
        lg: {
          x: 0,
          y: 0,
          w: 4,
          h: 2,
        },
      },
    });
    closeModal();
  });

  return (
    <div className="h-full flex flex-col justify-stretch">
      <div className="flex items-center justify-end">
        <button className="block relative" onClick={handleSave}>
          <span className="relative z-10 px-4 font-bold inline-flex gap-2 items-center text-blue-700">
            Save
          </span>
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <EditWidgetInstance
          props={props}
          onPropsChange={handlePropsChange}
          name={name} creating
        />
      </div>
    </div>
  );
}