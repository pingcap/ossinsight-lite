import { Rect } from '@oss-widgets/layout/src/core/types';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import layout from 'widgets:layout';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { useThrottleIdle } from '@oss-widgets/ui/hooks/throttle';
import { useComponentBindingContext } from '@oss-widgets/ui/hooks/binding/context';

type Notify = () => void;

declare module '@oss-widgets/ui/hooks/binding/context' {
  interface BindingMap {
    'layout-items': LayoutItem;
  }
}

function LayoutManager ({ children }: PropsWithChildren) {
  const { get, getAll, registerRaw, unregisterAllRaw, subscribeAll } = useComponentBindingContext('layout-items');
  const [v, setV] = useState(0);

  useEffect(() => {
    const browserCached = localStorage.getItem('widgets:layout');
    let realLayout = layout;

    if (browserCached) {
      realLayout = JSON.parse(browserCached);
    }
    realLayout.forEach((item: LayoutItem) => {
      registerRaw(item.id ?? item.name, item);
    });

    return () => {
      unregisterAllRaw();
    };
  }, []);

  const save = useRefCallback(() => {
    console.debug('[layout] save');
    // TODO: save to storage services.
    localStorage.setItem('widgets:layout', JSON.stringify(Object.values(getAll())));
  });

  const throttleSave = useThrottleIdle(save);

  useEffect(() => {
    return subscribeAll((type, target) => {
      throttleSave();
    });
  }, []);

  const duplicateItem: LayoutManagerContextValues['duplicateItem'] = useCallback((id, rect, props) => {
    const subject = get(id);
    if (subject) {
      const prev = subject.current;
      const prevRect: Rect = [...prev.rect];
      const prevProps = cloneJson(prev.props);
      const newOne = {
        id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
        name: prev.name,
        rect: rect?.(prevRect) ?? prevRect,
        props: props?.(prevProps) ?? prevProps,
      };
      registerRaw(newOne.id, newOne);
    }
  }, []);

  const download: LayoutManagerContextValues['download'] = useRefCallback(() => {
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

  return (
    <Context.Provider
      value={{
        saving: false,
        duplicateItem,
        download,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default function ({ children }: PropsWithChildren) {
  return (
    <LayoutManager>
      {children}
    </LayoutManager>
  );
}

export type LayoutItem = {
  id?: string | undefined
  name: string
  rect: Rect
  props: any
}

export type LayoutManagerContextValues = {
  saving: boolean,

  duplicateItem (id: string, rect?: (rect: Rect) => Rect, props?: (props: any) => any): void,
  download (): void,
};

const Context = createContext<LayoutManagerContextValues>({
  saving: false,

  duplicateItem () { },
  download () {},
});

const NO_OP_MAP = new Map<string, Map<string, Notify>>;
Object.freeze(NO_OP_MAP);

function useNotifyMap () {
  const mapRef = useRef(NO_OP_MAP);

  useEffect(() => {
    mapRef.current = new Map();
    return () => {
      mapRef.current.clear();
    };
  }, []);

  const set = useCallback((id: string, rid: string, notify: Notify) => {
    let curr = mapRef.current.get(id);
    if (!curr) {
      curr = new Map();
      mapRef.current.set(id, curr);
    }
    curr.set(rid, notify);
  }, []);

  const notify = useCallback((id: string) => {
    const curr = mapRef.current.get(id);
    if (curr) {
      for (const notify of curr.values()) {
        notify();
      }
    }
  }, []);

  const del = useCallback((id: string, rid: string) => {
    const curr = mapRef.current.get(id);
    if (curr) {
      curr.delete(rid);
      if (curr.size === 0) {
        mapRef.current.delete(id);
      }
    }
  }, []);

  return {
    set,
    notify,
    delete: del,
  };
}

export function useLayoutManager () {
  return useContext(Context);
}

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}
