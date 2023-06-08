import { library } from '@/core/bind';
import { useWatchItemField } from '@/packages/ui/hooks/bind';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { ChangeEvent } from 'react';

export default function Border ({ id }: { id: string }) {
  const { showBorder } = useWatchItemField('library', id, 'props');

  const handleChange = useRefCallback((event: ChangeEvent<HTMLInputElement>) => {
    library.update(id, (item, ctx) => {
      const checked = event.target.checked;
      if (checked) {
        if (!item.props.showBorder) {
          item.props = { ...item.props, showBorder: true };
        } else {
          ctx.changed = false;
        }
      } else {
        if (item.props.showBorder) {
          item.props = { ...item.props, showBorder: undefined };
        } else {
          ctx.changed = false;
        }
      }
      return item;
    });
  });

  return (

    <div className="flex items-center justify-between gap-2 text-gray-700">
      <span>Show border</span>
      <input type="checkbox" onChange={handleChange} checked={showBorder ?? false} />
    </div>
  );
}