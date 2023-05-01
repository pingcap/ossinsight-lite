import { Configuration } from 'webpack';
import base from './base.config';
import merge from 'webpack-merge';
import { cwd, devappSrc } from './utils/path';
import { getSources } from './utils/widgets';
import path from 'path';
import HtmlWebpackPlugin = require('html-webpack-plugin');
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default merge<Configuration>(base, {
  mode: 'production',
  entry: {
    main: devappSrc('main.tsx'),
    'devapp-entry': cwd('src/devapp-entry'),
  },
  devtool: false,
  devServer: {
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        common: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: devappSrc('index.ejs'),
    }),
    new HtmlWebpackPlugin({
      filename: `browse.html`,
      template: devappSrc('index.ejs'),
    }),
    ...Object.keys(getSources()).map((entry) => {
      return new HtmlWebpackPlugin({
        filename: `browse/${entry.replace(/\/index$/, '.html')}`,
        template: devappSrc('index.ejs'),
      });
    }),
  ],
  output: {
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/chunk.[name].js',
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename!)
        .split('/')
        .slice(1)
        .join('/');
      return `assets/${filepath}/[name][ext]`;
    },
    publicPath: 'auto',
    path: cwd('page-dist'),
  },
});
