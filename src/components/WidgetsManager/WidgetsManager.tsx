'use client';

import { dashboards, library } from '@/app/bind';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';
import { Rect } from '@ossinsight-lite/layout/src/core/types';
import { ReactBindCollections } from '@ossinsight-lite/ui/hooks/bind';
import { Fixup, Version } from '@ossinsight-lite/ui/hooks/migration';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import layout from '@ossinsight-lite/widgets/layout.json';
import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { useNullableDashboardItems } from '../../core/dashboard';
import type { LayoutConfigV0, LayoutConfigV1, LayoutItem, SavingFlags } from '../../types/config';
import { LibraryItem } from '../../types/config';

declare module '@ossinsight-lite/ui/hooks/bind' {
  interface CollectionsBindMap {
    'library': LibraryItem;
  }
}

export default function WidgetsManager ({ children }: PropsWithChildren<{}>) {
  const [saving, setSaving] = useState(false);
  const [savingFlags, setSavingFlags] = useState<SavingFlags>({});

  return (
    <ConfigContext.Provider value={{
      savingFlags,
      saving,
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

const ConfigContext = createContext<{

  saving: boolean
  savingFlags: SavingFlags
}>({
  saving: false,
  savingFlags: {},
});

export function useConfig () {
  return useContext(ConfigContext);
}

export type { LayoutItem } from '../../types/config';

export function toConfigV1 (currentConfig: LayoutConfigV1 | undefined, collections: ReactBindCollections): LayoutConfigV1 {

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
  const dashboard = useNullableDashboardItems(dashboardName);

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
    const a = document.createElement('a');
    a.href = '/api/layout.json';
    a.download = 'layout.json';
    a.click();
  });

  return { download, newItem };
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
      prev.dashboard = layout.dashboard.default as any;
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

export function duplicateItem (dashboardName: string, id: string, rect: (rect: Rect) => Rect, props?: (props: any) => any) {
  const dashboard = dashboards.getNullable(dashboardName)?.current.items;
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
}
