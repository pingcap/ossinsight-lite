import { Configuration } from 'webpack';
import base from './base.config.js';
import { merge } from 'webpack-merge';
import RemoveStyleJsPlugin from './plugins/RemoveStyleJsPlugin.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import libCommon from './lib-common.config.js';

export default merge<Configuration>(base, libCommon, {
  mode: 'production',
  plugins: [
    RemoveStyleJsPlugin(),
  ],
  experiments: {
    outputModule: true,
  },
  output: {
    globalObject: 'globalThis',
    library: {
      type: 'module',
    },
  },
  externals: [
    'react',
    'react-dom',
  ],
});
