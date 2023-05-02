import { Compiler, WebpackPluginFunction } from 'webpack';
const PLUGIN_NAME = 'RemoveStyleJsPlugin'
export default function RemoveStyleJsPlugin () {
  return function (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.processAssets.tap(PLUGIN_NAME, assets => {
        compilation.chunks.forEach(chunk => {
          if (/style$/.test(chunk.name)) {
            chunk.files.forEach(file => {
              if (/style\.js$/.test(file)) {
                delete compilation.assets[file];
              }
            });
          }
        });
      })
    })
  } satisfies WebpackPluginFunction;
}