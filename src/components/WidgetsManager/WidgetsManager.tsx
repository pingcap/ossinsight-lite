'use client';

import { Rect } from '@ossinsight-lite/layout/src/core/types';
import { createContext, PropsWithChildren, useCallback, useContext, useRef } from 'react';
import layout from '@ossinsight-lite/widgets/layout.json';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { ReactBindCollection, ReactBindCollections, useCollection, useReactBindCollections } from '@ossinsight-lite/ui/hooks/bind';
import { Fixup, migrate, Version } from '@ossinsight-lite/ui/hooks/migration';
import type { LayoutConfigV0, LayoutConfigV1, LayoutItem } from '../../types/config';
import { LibraryItem } from '../../types/config';
import { useSignal } from './signal';
import { useThrottleIdle } from '@ossinsight-lite/ui/hooks/throttle';
import { DashboardInstance, useNullableDashboardItems } from '../../core/dashboard';
import { isDev } from '@/packages/ui/utils/dev';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface CollectionsBindMap {
    'library': LibraryItem;
  }
}

export default function WidgetsManager ({ children }: PropsWithChildren) {
  const collections = useReactBindCollections();

  const configRef = useRef<LayoutConfigV1>();
  if (!configRef.current) {
    configRef.current = (() => {
      if (typeof window === 'undefined') {
        return { version: 1, library: [], dashboard: {} };
      }

      let browserCached: string | null | undefined;
      if (typeof localStorage !== 'undefined') {
        browserCached = localStorage.getItem('widgets:layout');
      }
      if (browserCached) {
        browserCached = JSON.parse(browserCached);
      }
      return migrate<LayoutConfigV1>(browserCached, { versions: layoutVersions, fixup: layoutVersionFixup });
    })();
  }

  const save = useSignal(useThrottleIdle((debugLabels: (string | void)[]) => {
    const newConfig = toConfigV1(configRef.current, collections);
    configRef.current = newConfig;
    localStorage.setItem('widgets:layout', JSON.stringify(newConfig));
    console.debug(`[config:v${newConfig.version}] saved to localStorage`);
    if (isDev) {
      const map = new Map<string, number>();
      debugLabels.forEach((label) => {
        if (!label) {
          return;
        }
        map.set(label, (map.get(label) ?? 0) + 1);
      });
      console.debug(`[config:v${newConfig.version}] triggered by`, Array.from(map.entries()).map(([value, n]) => {
        return `${n}x ${value}`;
      }));
    }
  }));

  return (
    <ConfigContext.Provider value={{ config: configRef.current, saveConfig: save }}>
      {children}
    </ConfigContext.Provider>
  );
}

const ConfigContext = createContext<{
  config: LayoutConfigV1
  saveConfig: (debugLabel?: string) => void
}>({
  config: null as never,
  saveConfig: () => {},
});

export function useConfig () {
  return useContext(ConfigContext);
}

export type { LayoutItem } from '../../types/config';

const WidgetCacheContext = createContext<Record<string, any>>({});

export function useWidgetCache () {
  return useContext(WidgetCacheContext);
}

export function toConfigV1 (currentConfig: LayoutConfigV1 | undefined, collections: ReactBindCollections): LayoutConfigV1 {
  const library = collections.getNullable('library')!;
  const dashboards: ReactBindCollection<DashboardInstance> = collections.getNullable('dashboards')!;

  return {
    version: 1,
    library: library.values,
    dashboard: [...dashboards.entries()].reduce((record, [key, dashboard]) => {
      record[String(key)] = {
        layout: dashboard.current.layout,
        items: dashboard.current.items.values,
      };
      return record;
    }, currentConfig?.dashboard ?? {}),
  };
}

export function useLayoutManager ({ dashboardName }: { dashboardName: string }) {
  const collections = useReactBindCollections();
  const library = useCollection('library');
  const dashboard = useNullableDashboardItems(dashboardName);
  const { config } = useConfig();

  const duplicateItem = useCallback((id: string, rect: (rect: Rect) => Rect, props?: (props: any) => any) => {
    if (!dashboard) {
      return;
    }
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
    if (!dashboard) {
      return;
    }
    const id = item.id ?? item.name;
    if (!library.has(id)) {
      library.add(id, item);
    }
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
            layout: defaultLayoutConfig,
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
    Object.values(prev.dashboard).forEach(d => {
      d.layout = {
        type: `gird:responsive`,
        size: [40, 16],
        gap: 8,
      };
    });
    if (!prev.dashboard.default) {
      prev.dashboard.default = {
        layout: {
          type: `gird:responsive`,
          size: [40, 16],
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

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}
