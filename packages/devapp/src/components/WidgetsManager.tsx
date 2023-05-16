import { Rect } from '@oss-widgets/layout/src/core/types';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useId, useState } from 'react';
import layout from 'widgets:layout';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { useThrottleIdle } from '@oss-widgets/ui/hooks/throttle';
import { ReactBindCollection, ReactBindCollections, useCollection, useReactBindCollections } from '@oss-widgets/ui/hooks/bind';
import { withSuspense } from '@oss-widgets/ui/utils/suspense';
import { Fixup, migrate, Version } from '@oss-widgets/ui/hooks/migration';
import type { ItemReference, LayoutConfigV0, LayoutConfigV1, LayoutItem } from '../types/config';
import { LibraryItem } from '../types/config';
import { Subscription } from 'rxjs';
import { BindingTypeEvent, Consume } from '@oss-widgets/ui/hooks/bind/types';

declare module '@oss-widgets/ui/hooks/bind' {
  interface BindMap extends Record<`dashboard.${string}.items`, ItemReference> {
    'library': LibraryItem;
  }
}

export default function WidgetsManager ({ children }: PropsWithChildren) {
  const collections = useReactBindCollections();
  const [config, setConfig] = useState<LayoutConfigV1 | undefined>();

  useEffect(() => {
    const library = collections.add('library');
    library.needLoaded();

    return () => {
      collections.del('library');
    };
  }, []);

  return (
    <div>
      <AutoSave onConfigLoaded={setConfig} config={config} />
      <ConfigContext.Provider value={{ config }}>
        {children}
      </ConfigContext.Provider>
    </div>
  );
}

const ConfigContext = createContext<{ config: LayoutConfigV1 | undefined }>({
  config: undefined,
});

export function useConfig () {
  return useContext(ConfigContext);
}

export type LayoutManager = ReturnType<typeof useLayoutManager>;

export type { LayoutItem } from '../types/config';

export function toConfigV1 (currentConfig: LayoutConfigV1 | undefined, collections: ReactBindCollections): LayoutConfigV1 {
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
    }, currentConfig?.dashboard ?? {}),
  };
}

export function useLayoutManager ({ dashboard, library }: { dashboard: ReactBindCollection<ItemReference>, library: ReactBindCollection<LibraryItem> }) {
  const collections = useReactBindCollections();
  const { config } = useConfig();

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
    const content = JSON.stringify(toConfigV1(config, collections), undefined, 2);
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

const AutoSave = withSuspense(function AutoSave ({ config, onConfigLoaded }: { config: LayoutConfigV1 | undefined, onConfigLoaded: Consume<LayoutConfigV1> }) {
  const id = useId();
  const library = useCollection('library');
  const collections = useReactBindCollections();

  const save = useRefCallback(() => {
    console.debug('[layout:autosave] save');

    // TODO: save to storage services.
    localStorage.setItem('widgets:layout', JSON.stringify(toConfigV1(config, collections)));
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
    const dashboardSubs: Subscription[] = [];
    const dashboardItemsMap = new Map<string, { dashboard: ReactBindCollection<ItemReference>, items: Set<string> }>();

    config.library.forEach(item => {
      const key = item.id ?? item.name;
      library.add(key, item);
      addedItems.add(key);
    });

    library.markLoaded();
    console.debug(`[layout] loaded version = ${config.version}`);

    const sub = library.subscribeAll(() => {
      throttleSave();
    });

    const initializeDashboard = (name: string, dashboard: ReactBindCollection<ItemReference>) => {
      let dashboardConfig = config.dashboard[name];
      if (!dashboardConfig) {
        // todo
        dashboardConfig = {
          layout: {
            type: 'grid',
            size: 40,
            gap: 8,
          },
          items: layout.map(({ id, name, rect }: any) => ({ id: id ?? name, name, rect })),
        };
      }

      const items = new Set<string>();

      dashboardItemsMap.set(name, { dashboard, items });

      dashboardConfig.items.forEach(item => {
        dashboard.add(item.id, item);
        items.add(item.id);
      });

      if (dashboard.isNeedLoaded) {
        dashboard.markLoaded();
      }

      throttleSave();
      dashboardSubs.push(dashboard.subscribeAll(() => {
        throttleSave();
      }));
    };

    collections.getByRegexp(/^dashboard\.(\w+)\.items$/).forEach(([name, dashboard]) => {
      initializeDashboard(name, dashboard);
    });

    const dashboardKeysSub = collections.events.subscribe(([dashboard, key, ev]) => {
      if (ev !== BindingTypeEvent.CREATED) {
        return;
      }
      const res = /^dashboard\.(\w+)\.items$/.exec(key);
      if (res) {
        const [, dashboardName] = res;
        initializeDashboard(dashboardName, dashboard);
      }
    });

    onConfigLoaded(config);

    return () => {
      dashboardKeysSub.unsubscribe();
      sub.unsubscribe();
      dashboardSubs.forEach(sub => sub.unsubscribe());

      [...dashboardItemsMap.values()].forEach(({ dashboard, items }) => {
        items.forEach(item => dashboard.del(item));
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
