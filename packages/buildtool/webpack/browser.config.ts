import { Configuration } from 'webpack';
import base from './base.config.js';
import { merge } from 'webpack-merge';
import * as path from 'node:path';
import * as process from 'node:process';
import RemoveStyleJsPlugin from './plugins/RemoveStyleJsPlugin.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import libCommon from './lib-common.config.js';

export default merge<Configuration>(base, libCommon, {
  mode: 'production',
  experiments: {
    outputModule: true,
  },
  plugins: [
    RemoveStyleJsPlugin(),
  ],
  output: {
    path: path.resolve(process.cwd(), 'page-dist/widgets'),
    globalObject: 'globalThis',
    library: {
      type: 'module',
    },
  },
  externalsType: 'global',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
});
