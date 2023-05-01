import WebpackDevServer = require('webpack-dev-server');
import webpack = require('webpack');
import config from '../webpack/development.config';
import merge from 'webpack-merge';
import Webpack from 'webpack';

const logging = require('webpack/lib/logging/runtime');
logging.configureDefaultLogger({
  level: 'error',
});

const port = process.env.PORT ?? config.devServer?.port ?? 3000;

const server = new WebpackDevServer({
  ...config.devServer,
  client: {
    logging: 'none',
  },
  port,
}, webpack(merge(config, {
  plugins: [
    new Webpack.EnvironmentPlugin({
      OSSW_SITE_DOMAIN: `http://localhost:${port}`,
    }),
  ],
  infrastructureLogging: {
    level: 'error',
  },
  stats: 'none',
})));

export default async function main () {
  await server.start();
}
