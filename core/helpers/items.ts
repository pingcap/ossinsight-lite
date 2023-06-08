import { dashboards } from '@/core/bind';
import libraryFeature from '@/store/features/library';
import store from '@/store/store';

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}

export function duplicateItem (dashboardName: string, id: string, props?: (props: any) => any) {
  const { library } = store.getState();
  const dashboard = dashboards.getNullable(dashboardName)?.current.items;
  if (!dashboard) {
    return;
  }
  const item = library.items[id];
  const itemReference = dashboard.getNullable(id);
  if (item && itemReference) {
    const prev = item;
    const prevProps = cloneJson(prev.props);
    const newItem = {
      id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
      name: prev.name,
      props: cloneJson(props?.(prevProps) ?? prevProps),
    };
    const newPosition = {
      id: newItem.id,
      layout: cloneJson(itemReference.current.layout),
    };
    store.dispatch(libraryFeature.actions.add({ item: newItem }));
    dashboard.add(newItem.id, newPosition);
  }
}
