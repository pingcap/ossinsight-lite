import { Rect } from '@oss-widgets/layout/src/core/types';
import { createContext, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import layout from 'widgets:layout';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import { useThrottleIdle } from '@oss-widgets/ui/hooks/throttle';

type Notify = () => void;

export default function LayoutManager ({ children }: PropsWithChildren) {
  const [items, setItems] = useState<LayoutItem[]>([]);
  const notifyRectMap = useNotifyMap();
  const notifyPropsMap = useNotifyMap();

  useEffect(() => {
    const browserCached = localStorage.getItem('widgets:layout');
    if (browserCached) {
      setItems(JSON.parse(browserCached));
    } else {
      setItems(layout);
    }
  }, []);

  const save = useRefCallback(() => {
    console.debug('[layout] save');
    // TODO: save to storage services.
    localStorage.setItem('widgets:layout', JSON.stringify(items));
  });

  const throttleSave = useThrottleIdle(save);

  const addItem: LayoutManagerContextValues['addItem'] = useCallback((id, name, rect, props) => {
    setItems(items => {
      return [...items, {
        id,
        name,
        rect,
        props,
      }];
    });
    throttleSave();
  }, []);

  const duplicateItem: LayoutManagerContextValues['duplicateItem'] = useCallback((id, rect, props) => {
    setItems(items => {
      const idx = findItemIndex(items, id);
      if (idx !== -1) {
        const prev = items[idx];
        const prevRect: Rect = [...prev.rect];
        const prevProps = cloneJson(prev.props);
        throttleSave();
        return [...items, {
          id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
          name: prev.name,
          rect: rect?.(prevRect) ?? prevRect,
          props: props?.(prevProps) ?? prevProps,
        }];
      }
      return items;
    });
  }, []);

  const removeItem: LayoutManagerContextValues['removeItem'] = useCallback((id) => {
    setItems(items => {
      const idx = findItemIndex(items, id);
      if (idx !== -1) {
        throttleSave();
        return [...items.slice(0, idx), ...items.slice(idx + 1)];
      }
      return items;
    });
  }, []);

  const updateItemRect: LayoutManagerContextValues['updateItemRect'] = useCallback((id, rect) => {
    setItems(items => {
      const idx = findItemIndex(items, id);
      if (idx !== -1) {
        items[idx].rect = rect;
        notifyRectMap.notify(id);
        throttleSave();
      }
      return items;
    });
  }, []);

  const updateItemProps: LayoutManagerContextValues['updateItemProps'] = useCallback((id, props) => {
    setItems(items => {
      const idx = findItemIndex(items, id);
      if (idx !== -1) {
        const item = items[idx];

        const originalProps = item.props;
        let newProps: any;
        if (typeof props === 'function') {
          newProps = props(originalProps);
        } else {
          newProps = props;
        }
        if (newProps !== originalProps) {
          item.props = newProps;
          notifyPropsMap.notify(id);
          throttleSave();
        }
      }
      return items;
    });
  }, []);

  const useRectNotify: LayoutManagerContextValues['useRectNotify'] = useCallback((id) => {
    const [version, setVersion] = useState(0);
    const rid = useId();

    useEffect(() => {
      notifyRectMap.set(id, rid, () => setVersion(v => v + 1));
      return () => {
        notifyRectMap.delete(id, rid);
      };
    }, [id]);

    return version;
  }, []);

  const usePropsNotify: LayoutManagerContextValues['usePropsNotify'] = useCallback((id) => {
    const [version, setVersion] = useState(0);
    const rid = useId();

    useEffect(() => {
      notifyPropsMap.set(id, rid, () => setVersion(v => v + 1));
      return () => {
        notifyPropsMap.delete(id, rid);
      };
    }, [id]);

    return version;
  }, []);

  const useItem: LayoutManagerContextValues['useItem'] = useRefCallback((id) => {
    const idx = findItemIndex(items, id);
    usePropsNotify(id);
    return items[idx];
  });

  const download: LayoutManagerContextValues['download'] = useRefCallback(() => {
    const content = JSON.stringify(items, undefined, 2);
    const file = new File([content], 'layout.json', {
      type: 'application/json',
      endings: 'native'
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
        items,
        saving: false,
        addItem,
        removeItem,
        duplicateItem,
        updateItemRect,
        updateItemProps,
        useRectNotify,
        usePropsNotify,
        useItem,
        download,
      }}
    >
      {children}
    </Context.Provider>
  );

}

export type LayoutItem = {
  id?: string | undefined
  name: string
  rect: Rect
  props: any
}

export type LayoutManagerContextValues = {
  items: LayoutItem[],
  saving: boolean,

  addItem (id: string | undefined, name: string, rect: Rect, props: any): void
  removeItem (id: string): void,
  duplicateItem (id: string, rect?: (rect: Rect) => Rect, props?: (props: any) => any): void,
  updateItemRect (id: string, rect: Rect): void,
  updateItemProps (id: string, props: SetStateAction<any>): void,

  useRectNotify (id: string): number,
  usePropsNotify (id: string): number,
  useItem (id: string): LayoutItem | undefined,

  download (): void,
};

const Context = createContext<LayoutManagerContextValues>({
  items: [],
  saving: false,

  addItem () {},
  removeItem () {},
  duplicateItem () { },
  updateItemRect () {},
  updateItemProps () {},
  useRectNotify () { return NaN; },
  usePropsNotify () { return NaN; },
  useItem (id: string) { return undefined; },
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

function findItemIndex (items: LayoutItem[], id: string): number {
  let idx = items.findIndex(item => item.id === id);
  if (idx == -1) {
    idx = items.findIndex(item => item.name === id);
  }
  return idx;
}
