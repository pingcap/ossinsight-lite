const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const withSvgr = require('next-plugin-svgr');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, context) => {

    config.module.rules.push({
      test: /\/widgets-manifest\.ts$/,
      use: [
        context.defaultLoaders.babel,
        {
          loader: require.resolve('./packages/buildtool/dist/webpack/loaders/widgets-manifest')
        },
      ]
    }, {
      test: /\.sql$/,
      use: [
        context.defaultLoaders.babel,
        {
          loader: require.resolve('./packages/buildtool/dist/webpack/loaders/sql')
        },
      ]
    })
    config.plugins.push(new (require('./packages/buildtool/dist/webpack/plugins/db/SQLPlugin')))
    config.plugins.push(new MonacoWebpackPlugin({
      languages: ['mysql', 'markdown'],
    }))

    config.resolve.alias['roughjs'] = 'roughjs/bundled/rough.esm.js'

    config.externals.push('@napi-rs/canvas')

    return config;
  },
  svgrOptions: {
    ref: true,
    svgo: false,
    replaceAttrValues: {
      fill: 'currentColor',
    },
  },
  onDemandEntries: {},
  experimental: {
    appDir: true,
    // typedRoutes: true,
    serverComponentsExternalPackages: ["mysql2"],
    serverActions: true,
  },
}

module.exports = withSvgr(nextConfig)
