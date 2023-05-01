import { Configuration } from 'webpack';
import base from './base.config';
import merge from 'webpack-merge';
import { cwd, devappSrc } from './utils/path';
import HtmlWebpackPlugin = require('html-webpack-plugin');

export default merge<Configuration>(base, {
  mode: 'development',
  experiments: {

  },
  entry: {
    main: {
      import: devappSrc('main.tsx'),
      dependOn: 'vendor',
    },
    vendor: ['react', 'react/jsx-runtime', 'react-dom'],
    'devapp-entry': cwd('src/devapp-entry'),
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    historyApiFallback: true,
    // open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: devappSrc('index.ejs'),
    }),
  ],
  output: {
    publicPath: '/'
  }
});
