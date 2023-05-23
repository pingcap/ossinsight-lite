import { WidgetModuleMeta } from '../widgets-manifest';

export function getConfigurable (module: WidgetModuleMeta, props?: any) {
  const configurable = module.configurable;
  if (typeof configurable === 'function') {
    return configurable({ ...module.defaultProps, ...props });
  }
  return configurable ?? false;
}
