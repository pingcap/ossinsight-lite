import { WebpackPluginFunction } from 'webpack';
import { buildtoolSrc, webpackBuildSrc } from '../utils/path.js';

const PLUGIN_NAME = 'AppSchemePlugin';

export default function appSchemePlugin () {
  return function (compiler) {
    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, ({
      normalModuleFactory,
    }) => {
      normalModuleFactory.hooks.resolveForScheme.for('widgets').tap(PLUGIN_NAME, (req, data) => {
        req.resource = req.resource.replace(/^widgets:/, webpackBuildSrc('val/')) + '.js';
        return true;
      });

      normalModuleFactory.hooks.beforeResolve.tap(PLUGIN_NAME, req => {
        if (req.request.startsWith('widgets:')) {
          req.request = req.request.replace(/^widgets:/, buildtoolSrc('runtime/webpack/val/')) + '.js';
        }
      })
    });
  } satisfies WebpackPluginFunction;
}