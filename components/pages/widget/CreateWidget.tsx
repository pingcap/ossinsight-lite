'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import EditWidgetInstance from '@/components/EditWidgetInstance';
import { library } from '@/core/bind';
import { widgets } from '@/core/bind-client';
import { readItem, singletons } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useCallback, useContext, useState } from 'react';

export interface CreateWidgetProps {
  name: string;
}

export default function CreateWidget ({ name }: CreateWidgetProps) {
  const canvas = singletons.getNullable('dashboard');
  const widget = readItem(widgets, name);
  const { closeModal } = useContext(ModalContext);

  const [props, setProps] = useState(() => {
    return { ...widget.current.defaultProps };
  });

  const handlePropsChange = useCallback((key: string, value: any) => {
    setProps(props => ({ ...props, [key]: value }));
  }, []);

  const handleSave = useRefCallback(() => {
    const id = `${name}-${Date.now()}`;
    library.add(id, {
      id,
      name,
      props,
    });
    if (canvas?.current) {
      canvas.current.items.add(id, {
        id,
        layout: {
          xl: {
            x: 0,
            y: 0,
            w: 4,
            h: 2,
          },
        },
      });
    }
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