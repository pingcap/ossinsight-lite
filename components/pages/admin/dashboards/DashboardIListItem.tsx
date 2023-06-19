import { updateDashboardName } from '@/actions/dashboards';
import { ChangeVisibleButton, DeleteDashboardButton } from '@/components/pages/admin/dashboards/forms';
import LoadingIndicator from '@/packages/ui/components/loading-indicator';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import { useServerAction } from '@/utils/server/action';
import CheckIcon from 'bootstrap-icons/icons/check.svg';
import PencilIcon from 'bootstrap-icons/icons/pencil.svg';
import XIcon from 'bootstrap-icons/icons/x.svg';
import Link from 'next/link';
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

export default function DashboardIListItem ({ item }: { item: { name: string, properties: any, visibility: 'public' | 'private', items_count: number } }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const { running, error, action } = useServerAction(updateDashboardName);

  const link = newName === 'default' ? `/` : `/dashboards/${newName}`;

  useEffect(() => {
    setNewName(item.name);
  }, [item]);

  const startEdit = useRefCallback(() => {
    setNewName(item.name);
    setEditing(true);
  });

  const stopEdit = useRefCallback(() => {
    action(item.name, newName)
      .then(() => {
        setEditing(false);
      });
  });

  const cancelEdit = useRefCallback(() => {
    setNewName(item.name);
    setEditing(false);
  });

  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setNewName(ev.target.value);
  }, []);

  const handleKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      stopEdit();
      ev.preventDefault();
      ev.stopPropagation();
    }
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <li>
      <span className="w-60">
        <span className="column flex gap-2 items-baseline">
          {editing
            ? (
              <span className="text-lg">
                <input className="outline-none border-b w-full" ref={inputRef} value={newName} onChange={handleChange} placeholder="New dashboard name" onKeyDown={handleKeyDown} disabled={running} />
              </span>
            ) : (
              <span className="flex text-lg">
                <Link className="underline" href={link}>
                  {newName}
                </Link>
              </span>
            )}
          {item.name !== 'default' && <span className="text-sm flex items-center gap-1">
            {editing
              ? (
                running
                  ? <LoadingIndicator />
                  : (
                    <>
                      <button className="text-green-400" onClick={stopEdit}><CheckIcon width={16} height={16} /></button>
                      <button className="text-red-400" onClick={cancelEdit}><XIcon width={16} height={16} /></button>
                    </>
                  )
              )
              : <button onClick={startEdit}><PencilIcon width={12} height={12} /></button>}
          </span>}
        </span>
      </span>
      <div className="column flex gap-1 items-center">
        <span className="text-secondary text-xs">
          {item.items_count} widgets
        </span>

        {item.name !== 'default' && (
          <>
            <ChangeVisibleButton name={item.name} visibility={item.visibility} />
            <DeleteDashboardButton name={item.name} />
          </>
        )}
      </div>
    </li>
  );
}