import { Configuration } from 'webpack';
import { getSources, getStyles } from './utils/widgets';
import MySQLPlugin from './plugins/MySQLPlugin';
import { buildtoolSrc, cwd, webpackBuildSrc } from './utils/path';
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import reportPlugin from './plugins/ReportPlugin';
import * as path from 'path';

export default {
  entry: {
    ...getSources(),
    ...getStyles(),
  },
  output: {
    filename: '[name].js',
    publicPath: 'auto',
  },
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new MySQLPlugin(),
    reportPlugin(),
  ],
  resolveLoader: {
    modules: [
      'node_modules',
      buildtoolSrc('node_modules'),
      webpackBuildSrc('loaders'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        include: [/.*/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/env',
              '@babel/typescript',
              ['@babel/react', {
                'runtime': 'automatic',
              }],
            ],
            plugins: [
              '@babel/syntax-import-assertions'
            ]
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  'postcss-preset-env': {},
                  'tailwindcss': {},
                  'autoprefixer': {},
                },
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [{
          loader: '@svgr/webpack',
          options: {
            ref: true,
            jsxRuntime: 'automatic',
            typescript: true,
            svgo: false,
            replaceAttrValues: {
              fill: 'currentColor',
            },
          },
        }],
      },
      {
        test: /\.sql(?:\?unique)?$/,
        use: [
          webpackBuildSrc('loaders/mysql'),
        ],
      },
      {
        test: /widgets-manifest(?:\.ts)?$/,
        use: [
          webpackBuildSrc('loaders/widgets-manifest'),
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                '@babel/typescript',
              ],
              plugins: [
                '@babel/syntax-import-assertions'
              ]
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      'roughjs': 'roughjs/bundled/rough.esm.js',
    },
  },
} satisfies Configuration;