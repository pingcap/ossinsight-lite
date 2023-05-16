import { Rect } from '@oss-widgets/layout/src/core/types';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import layout from 'widgets:layout';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { ReactBindCollection, ReactBindCollections, useReactBindCollections } from '@oss-widgets/ui/hooks/bind';
import { Fixup, migrate, Version } from '@oss-widgets/ui/hooks/migration';
import type { ItemReference, LayoutConfigV0, LayoutConfigV1, LayoutItem } from '../../types/config';
import { LibraryItem } from '../../types/config';
import { AutoSaveLibrary } from './AutoSaveLibrary';
import { useSignal } from './signal';
import { PureCallback } from '@oss-widgets/ui/hooks/bind/types';
import { useThrottleIdle } from '@oss-widgets/ui/hooks/throttle';

export const DashboardKeyRegExp = /^dashboard\.(\w+)\.items$/;
export type DashboardKey = `dashboard.${string}.items`

declare module '@oss-widgets/ui/hooks/bind' {
  interface BindMap extends Record<DashboardKey, ItemReference> {
    'library': LibraryItem;
  }
}

export default function WidgetsManager ({ children }: PropsWithChildren) {
  const collections = useReactBindCollections();

  const [config, setConfig] = useState(() => {
    let browserCached = localStorage.getItem('widgets:layout');
    if (browserCached) {
      browserCached = JSON.parse(browserCached);
    }
    return migrate<LayoutConfigV1>(browserCached, { versions: layoutVersions, fixup: layoutVersionFixup });
  });

  const save = useSignal(useThrottleIdle(() => {
    const newConfig = toConfigV1(config, collections);
    setConfig(newConfig);
    localStorage.setItem('widgets:layout', JSON.stringify(newConfig));
  }));

  useEffect(() => {
    const library = collections.add('library');
    library.needLoaded();

    return () => {
      collections.del('library');
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ config, saveConfig: save }}>
      <AutoSaveLibrary />
      {children}
    </ConfigContext.Provider>
  );
}

const ConfigContext = createContext<{
    config: LayoutConfigV1
    saveConfig: PureCallback
  }>({
    config: null as never,
    saveConfig: () => {},
  })
;

export function useConfig () {
  return useContext(ConfigContext);
}

export type { LayoutItem } from '../../types/config';

export function toConfigV1 (currentConfig: LayoutConfigV1 | undefined, collections: ReactBindCollections): LayoutConfigV1 {
  const library = collections.getNullable('library')!;
  const dashboards = collections.getByRegexp(DashboardKeyRegExp);

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

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}
