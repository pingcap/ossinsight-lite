import { Compiler, WebpackPluginFunction } from 'webpack';

export default function RemoveStyleJsPlugin () {
  return function (compiler: Compiler) {
    compiler.hooks.emit.tapAsync('CssEntryPlugin', (compilation, callback) => {
      compilation.chunks.forEach(chunk => {
        if (/style$/.test(chunk.name)) {
          chunk.files.forEach(file => {
            if (/style\.js$/.test(file)) {
              delete compilation.assets[file];
            }
          });
        }
      });
      callback();
    });
  } satisfies WebpackPluginFunction;
}