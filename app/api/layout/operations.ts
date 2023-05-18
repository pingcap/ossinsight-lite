import kv from '@/app/api/kv';
import { Dashboard, LayoutConfigV1, LibraryItem, Store } from '@/src/types/config';
import layout from '@ossinsight-lite/widgets/layout.json';
import { isKvConfigured } from '@/src/utils/runtime';

export async function getAllDashboards () {
  let store: Store | undefined;
  let resolved: Record<string, Dashboard> | undefined | null;
  try {
    resolved = await kv.hgetall<Record<string, Dashboard>>('dashboards');
    store = 'kv';
  } catch {
  }

  if (!resolved) {
    if (typeof localStorage !== 'undefined') {
      const dashboards = localStorage.getItem('widgets:dashboards');
      if (dashboards) {
        resolved = JSON.parse(dashboards) as Record<string, Dashboard>;
        store = 'localStorage';
      }
    }
  }
  if (!resolved) {
    resolved = layout.dashboard as never as Record<string, Dashboard>;
    store = 'new';
  }
  return [store!, resolved] as const;
}

export async function getLibrary () {
  let resolved: LibraryItem[] | undefined | null;
  let store: Store | undefined;
  try {
    const all = await kv.hgetall<Record<string, LibraryItem>>('library');
    if (all) {
      resolved = [...Object.values(all)];
      store = 'kv';
    }
  } catch {
  }

  if (!resolved) {
    if (typeof localStorage !== 'undefined') {
      const library = localStorage.getItem('widgets:library');
      if (library) {
        resolved = JSON.parse(library);
        store = 'localStorage';
      }
    }
  }

  if (!resolved) {
    resolved = layout.library as LibraryItem[];
    store = 'new';
  }

  return [store!, resolved] as const;
}

/**
 * @deprecated
 */
export async function saveLayout (config: LayoutConfigV1) {
  let flags: any = {};
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('widgets:library', JSON.stringify(config.library));
    localStorage.setItem('widgets:dashboards', JSON.stringify(config.dashboard));
    flags.localStorage = true;
  }
  if (isKvConfigured) {
    try {
      const library = config.library;
      await kv.multi()
        .del('library')
        .hset('library', library.reduce((rec, item) => {
          rec[item.id ?? item.name] = item;
          return rec;
        }, {} as Record<string, LibraryItem>))
        .del('dashboards')
        .hset('dashboards', config.dashboard)
        .exec()
      ;
      flags.kv = true;
    } catch {
    }
  } else {
    const res = await fetch('/api/layout', {
      method: 'POST',
      body: JSON.stringify(config),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    Object.assign(flags, await res.json());
  }
  return flags;
}
