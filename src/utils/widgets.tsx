import { WidgetModuleMeta } from '../widgets-manifest';

export function getConfigurable (module: WidgetModuleMeta, props?: any) {
  return !!module.configureComponent;
}

export function getStyleConfigurable (module: WidgetModuleMeta, props?: any) {
  const configurable = module.styleConfigurable;
  if (typeof configurable === 'function') {
    return configurable({ ...module.defaultProps, ...props });
  }
  return configurable ?? false;
}
