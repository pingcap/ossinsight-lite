import { Rect } from '@oss-widgets/layout/src/core/types';
import { PropsWithChildren, useCallback, useEffect, useId } from 'react';
import layout from 'widgets:layout';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { useThrottleIdle } from '@oss-widgets/ui/hooks/throttle';
import { useCollection, useReactBindCollections } from '@oss-widgets/ui/hooks/bind';
import { withSuspense } from '@oss-widgets/ui/utils/suspense';

declare module '@oss-widgets/ui/hooks/bind' {
  interface BindMap {
    'layout-items': LayoutItem;
  }
}

export default function WidgetsManager ({ children }: PropsWithChildren) {
  const collections = useReactBindCollections();
  const id = useId();

  useEffect(() => {
    const collection = collections.add('layout-items');
    collection.needLoaded();

    return () => {
      collections.del('layout-items');
    };
  }, []);

  return (
    <div>
      <AutoSave />
      {children}
    </div>
  );
}

export type LayoutItem = {
  id?: string | undefined
  name: string
  rect: Rect
  props: any
}

export type LayoutManager = ReturnType<typeof useLayoutManager>;

export function useLayoutManager () {
  const collection = useCollection('layout-items');

  const getAll = useRefCallback(() => {
    return [...collection.entries()]
      .reduce((res, [k, v]) => {
        res[k as string] = v.current;
        return res;
      }, {} as Record<string, LayoutItem>);
  });

  const duplicateItem = useCallback((id: string, rect: (rect: Rect) => Rect, props?: (props: any) => any) => {
    const subject = collection.getNullable(id);
    if (subject) {
      const prev = subject.current;
      const prevRect: Rect = [...prev.rect];
      const prevProps = cloneJson(prev.props);
      const newOne = {
        id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
        name: prev.name,
        rect: [...(rect?.(prevRect) ?? prevRect)] as Rect,
        props: cloneJson(props?.(prevProps) ?? prevProps),
      };
      collection.add(newOne.id, newOne);
    }
  }, []);

  const download = useRefCallback(() => {
    const content = JSON.stringify(Object.values(getAll()), undefined, 2);
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

  return { download, duplicateItem };
}

const AutoSave = withSuspense(function AutoSave () {
  const id = useId();
  const collection = useCollection('layout-items');

  const save = useRefCallback(() => {
    console.debug('[layout:autosave] save');

    // TODO: save to storage services.
    localStorage.setItem('widgets:layout', JSON.stringify([...collection.entries()]
      .map(([_, v]) => v.current)));
  });

  const throttleSave = useThrottleIdle(save);

  useEffect(() => {
    console.debug('[layout:autosave] loading cached = %o, rid = %o', !!localStorage.getItem('widgets:layout'), id);
    const browserCached = localStorage.getItem('widgets:layout');
    let realLayout = layout;
    let added = new Set<string>();

    if (browserCached) {
      realLayout = JSON.parse(browserCached);
    }
    realLayout.forEach((item: LayoutItem) => {
      const key = item.id ?? item.name;
      collection.add(key, item);
      added.add(key);
    });
    collection.markLoaded();

    console.debug('[layout:autosave] loaded');
    const sub = collection.subscribeAll(() => {
      throttleSave();
    });
    return () => {
      console.debug('[layout:autosave] clean rid = %o', id);
      collection.resetLoaded();
      sub.unsubscribe();
      added.forEach(key => collection.del(key));
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
