'use client';
import { currentDashboard, library } from '@/core/bind';
import { widgets } from '@/core/bind-client';
import EditWidgetInstance from '@/components/EditWidgetInstance';
import { readItem } from '@/packages/ui/hooks/bind';
import { useCallback, useState } from 'react';
import colors from 'tailwindcss/colors';

export default function ({ params }: any) {
  const name = decodeURIComponent(params.name);
  const widget = readItem(widgets, name);

  const [props, setProps] = useState(() => {
    return { ...widget.current.defaultProps };
  });

  const handlePropsChange = useCallback((key: string, value: any) => {
    setProps(props => ({ ...props, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    const id = `${name}-${Date.now()}`;
    library.add(id, {
      id,
      name,
      props,
    });
    if (currentDashboard.current) {
      currentDashboard.current.items.add(id, {
        id,
        rect: widget.current.defaultRect ?? [0, 0, 8, 3],
      });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col justify-stretch">
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
