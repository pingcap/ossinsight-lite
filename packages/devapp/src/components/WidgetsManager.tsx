import { Rect } from '@oss-widgets/layout/src/core/types';
import { PropsWithChildren, useCallback, useEffect, useId } from 'react';
import layout from 'widgets:layout';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { useThrottleIdle } from '@oss-widgets/ui/hooks/throttle';
import { ReactBindCollections, useCollection, useReactBindCollections } from '@oss-widgets/ui/hooks/bind';
import { withSuspense } from '@oss-widgets/ui/utils/suspense';
import { Fixup, migrate, Version } from '@oss-widgets/ui/hooks/migration';
import type { Dashboard, ItemReference, LayoutConfigV0, LayoutConfigV1, LayoutItem } from '../types/config';
import { LibraryItem } from '../types/config';

declare module '@oss-widgets/ui/hooks/bind' {
  interface BindMap extends Record<`dashboard.${string}.items`, ItemReference> {
    'library': LibraryItem;
  }
}

export default function WidgetsManager ({ children }: PropsWithChildren) {
  const collections = useReactBindCollections();
  const id = useId();

  useEffect(() => {
    const collection = collections.add('library');
    collection.needLoaded();

    return () => {
      collections.del('library');
    };
  }, []);

  return (
    <div>
      <AutoSave />
      {children}
    </div>
  );
}

export type LayoutManager = ReturnType<typeof useLayoutManager>;

export type { LayoutItem } from '../types/config';

export function toConfigV1 (collections: ReactBindCollections): LayoutConfigV1 {
  const library = collections.getNullable('library')!;
  const dashboards = collections.getByRegexp(/^dashboard\.(\w+)\.items$/);

  return {
    version: 1,
    library: library.values,
    dashboard: dashboards.reduce((record, [key, dashboard]) => {
      record[key] = {
        layout: {
          type: 'grid',
          size: 40,
          gap: 8,
        },
        items: dashboard.values,
      };
      return record;
    }, {} as Record<string, Dashboard>),
  };
}

export function useLayoutManager () {
  const collections = useReactBindCollections();
  const library = useCollection('library');
  const dashboard = useCollection('dashboard.default.items');

  const duplicateItem = useCallback((id: string, rect: (rect: Rect) => Rect, props?: (props: any) => any) => {
    const subject = library.getNullable(id);
    const position = dashboard.getNullable(id);
    if (subject && position) {
      const prev = subject.current;
      const prevRect: Rect = [...position.current.rect];
      const prevProps = cloneJson(prev.props);
      const newItem = {
        id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
        name: prev.name,
        props: cloneJson(props?.(prevProps) ?? prevProps),
      };
      const newPosition = {
        id: newItem.id,
        rect: [...(rect?.(prevRect) ?? prevRect)] as Rect,
      };
      library.add(newItem.id, newItem);
      dashboard.add(newItem.id, newPosition);
    }
  }, []);

  const newItem = useCallback(({ rect, ...item }: LayoutItem) => {
    const id = item.id ?? item.name;
    library.add(id, item);
    dashboard.add(id, {
      id,
      rect,
    });
  }, []);

  const download = useRefCallback(() => {
    const content = JSON.stringify(toConfigV1(collections), undefined, 2);
    const file = new File([content], 'layout.json', {
      type: 'application/json',
      endings: 'native',
    });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = 'layout.json';
    a.click();

    requestIdleCallback(() => {
      URL.revokeObjectURL(url);
    });
  });

  return { download, duplicateItem, newItem };
}

const layoutVersions: Version[] = [
  {
    version: 0,
    migrate: prev => {
      let layoutConfig;
      if (prev) {
        layoutConfig = prev;
      }
      if (!layoutConfig) {
        layoutConfig = layout;
      }
      return layoutConfig;
    },
  },
  {
    version: 1,
    migrate (prev: LayoutConfigV0): LayoutConfigV1 {
      return {
        version: 1,
        library: prev.map(({ rect, ...rest }) => {
          return rest;
        }),
        dashboard: {
          default: {
            layout: {
              type: 'grid',
              size: 40,
              gap: 8,
            },
            items: prev.map(({ id, name, rect }) => ({
              id: id ?? name,
              rect,
            })),
          },
        },
      };
    },
  },
];

const layoutVersionFixup: Record<string | number, Fixup> = {
  [1]: (prev: LayoutConfigV1): LayoutConfigV1 => {
    if (!prev.dashboard.default) {
      prev.dashboard.default = {
        layout: {
          type: 'grid',
          size: 40,
          gap: 8,
        },
        items: layout.map(({ id, name, rect }: any) => ({
          id: id ?? name,
          rect,
        })),
      };
    }
    return prev;
  },
};

const AutoSave = withSuspense(function AutoSave () {
  const id = useId();
  const library = useCollection('library');
  const collections = useReactBindCollections();

  const save = useRefCallback(() => {
    console.debug('[layout:autosave] save');

    // TODO: save to storage services.
    localStorage.setItem('widgets:layout', JSON.stringify(toConfigV1(collections)));
  });

  const throttleSave = useThrottleIdle(save);

  useEffect(() => {
    console.debug('[layout] loading cached = %o, rid = %o', !!localStorage.getItem('widgets:layout'), id);
    let browserCached = localStorage.getItem('widgets:layout');
    if (browserCached) {
      browserCached = JSON.parse(browserCached);
    }
    let config = migrate<LayoutConfigV1>(browserCached, { versions: layoutVersions, fixup: layoutVersionFixup });
    let addedItems = new Set<string>();
    let addedDashboards = new Map<string, Set<string>>();

    config.library.forEach(item => {
      const key = item.id ?? item.name;
      library.add(key, item);
      addedItems.add(key);
    });

    library.markLoaded();
    console.debug(`[layout] loaded version = ${config.version}`);

    for (let [name, dashboardConfig] of Object.entries(config.dashboard)) {
      const dashboard = collections.add(`dashboard.${name}.items`);
      const addedItems = new Set<string>;

      dashboardConfig.items.forEach(item => {
        dashboard.add(item.id, item);
      });

      addedDashboards.set(name, addedItems);
    }

    const sub = library.subscribeAll(() => {
      throttleSave();
    });

    const dashboards = collections.getByRegexp(/^dashboard\.(\w+)\.items$/);

    const dashboardSubs = dashboards.map(([, dashboard]) => dashboard.subscribeAll(() => {
      throttleSave();
    }));

    return () => {
      sub.unsubscribe();
      dashboardSubs.forEach(sub => sub.unsubscribe());

      console.debug('[layout] clean rid = %o', id);

      addedDashboards.forEach((items, name) => {
        const dashboard = collections.getNullable(`dashboard.${name}.items`)!;
        dashboard.resetLoaded();
        items.forEach(item => dashboard.del(item));
        collections.del(`dashboard.${name}.items`);
      });

      library.resetLoaded();
      addedItems.forEach(key => library.del(key));
    };
  }, []);

  return <></>;
});

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}
