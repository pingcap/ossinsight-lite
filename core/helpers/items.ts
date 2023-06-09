import dashboardsFeature from '@/store/features/dashboards';
import libraryFeature from '@/store/features/library';
import store from '@/store/store';

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}

export function duplicateItem (id: string, props?: (props: any) => any) {
  const { library, dashboards } = store.getState();

  const item = library.items[id];
  if (!dashboards.current) {
    return;
  }
  const dashboard = dashboards.dashboards[dashboards.current];
  const oldItem = dashboard.items[id];
  if (dashboard && item && oldItem) {
    const prev = item;
    const prevProps = cloneJson(prev.props);
    const newItem = {
      id: `${prev.name}-${Math.round(Date.now() / 1000)}`,
      name: prev.name,
      props: cloneJson(props?.(prevProps) ?? prevProps),
    };
    const newReference = {
      id: newItem.id,
      layout: cloneJson(oldItem.layout),
    };
    store.dispatch(libraryFeature.actions.add({ item: newItem }));
    store.dispatch(dashboardsFeature.actions.add({ item: newReference }));
  }
}
