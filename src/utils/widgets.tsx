import { widgets } from '@/app/bind-client';
import { LibraryItem } from '@/src/types/config';
import { ResolvedWidgetModule, WidgetModuleMeta } from '../widgets-manifest';

export function getConfigurable (module: WidgetModuleMeta) {
  return !!module.configureComponent;
}

export function getStyleConfigurable (module: WidgetModuleMeta, props?: any) {
  const configurable = module.styleConfigurable;
  if (typeof configurable === 'function') {
    return configurable({ ...module.defaultProps, ...props });
  }
  return configurable ?? false;
}

export function getDuplicable (module: WidgetModuleMeta) {
  return module.duplicable ?? false;
}

export async function groupItemsByCategory (items: LibraryItem[]) {
  const names = Array.from(new Set(items.map(item => item.name)));
  const resolvedWidgets = (await Promise.all(names.map(name => widgets.get(name)))).map(w => w.current);

  const widgetsMap: Record<string, ResolvedWidgetModule> = {};
  for (let i = 0; i < names.length; i++) {
    widgetsMap[names[i]] = resolvedWidgets[i];
  }

  return items.reduce((map, item) => {
    const category = widgetsMap[item.name]!.category;
    map[category] ||= [];
    map[category].push(item);
    return map;
  }, {} as Record<string, LibraryItem[]>);
}
