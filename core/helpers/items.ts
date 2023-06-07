import { dashboards, library } from '@/core/bind';

function cloneJson<T> (val: T): T {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return val;
}

export function duplicateItem (dashboardName: string, id: string, props?: (props: any) => any) {
  const dashboard = dashboards.getNullable(dashboardName)?.current.items;
  if (!dashboard) {
    return;
  }
  const item = library.getNullable(id);
  const itemReference = dashboard.getNullable(id);
  if (item && itemReference) {
    const prev = item.current;
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
    library.add(newItem.id, newItem);
    dashboard.add(newItem.id, newPosition);
  }
}
