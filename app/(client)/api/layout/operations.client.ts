import { Command } from '@/core/commands';
import store from '@/store/store';
import { LayoutStore } from '@/utils/types/config';

export async function commit (commands: Command[]) {
  const data = store.getState().auth.queries['reload(undefined)']?.data;
  const authenticated = (data as any).authenticated;
  const resultStore: Partial<Record<LayoutStore, boolean>> = {};
  if (authenticated) {
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
          resultStore.tidb = (await res.json()).tidb;
        }
      } catch {
        resultStore.tidb = false;
      }
    }
  } else {
    //
    resultStore.localStorage = true;
  }
  return resultStore;
}
