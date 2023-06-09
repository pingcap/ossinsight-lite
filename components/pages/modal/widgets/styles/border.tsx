import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useLibraryItemField, useUpdateLibraryItem } from '@/store/features/library';
import { ChangeEvent } from 'react';

export default function Border ({ id }: { id: string }) {
  const showBorder = useLibraryItemField(id, item => item.props.showBorder);
  const updateLibraryItem = useUpdateLibraryItem();

  const handleChange = useRefCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateLibraryItem(id, (item, ctx) => {
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