import { Command } from '@/core/commands';
import { defaultLayoutConfig } from '@/core/layout/defaults';
import { Dashboard, ItemReference, LibraryItem, Store } from '@/utils/types/config';

export async function commit (commands: Command[]) {
  const store: Partial<Record<Store, boolean>> = {};
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commands),
      });
      if (res.ok) {
        store.tidb = (await res.json()).tidb;
      }
    } catch {
      store.tidb = false;
    }
  }
  return store;
}
