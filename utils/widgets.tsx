import type { ResolvedWidgetModule, WidgetModule, WidgetModuleMeta } from '@/core/widgets-manifest';
import { useResolvedWidgets } from '@/store/features/widgets';
import type { LibraryItem } from '@/utils/types/config';

export function getConfigurable (module: WidgetModule | ResolvedWidgetModule) {
  return !!module.ConfigureComponent;
}

export function getStyleConfigurable (module: WidgetModuleMeta) {
  const configurable = module.styleConfigurable;
  return configurable ?? false;
}

export function getDuplicable (module: WidgetModuleMeta) {
  return module.duplicable ?? false;
}

export function groupItemsByCategory (items: LibraryItem[]) {
  const widgetsMap = useResolvedWidgets();

  return items.reduce((map, item) => {
    const category = widgetsMap[item.name]!.category;
    map[category] ||= [];
    map[category].push(item);
    return map;
  }, {} as Record<string, LibraryItem[]>);
}
