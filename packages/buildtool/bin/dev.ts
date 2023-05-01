import WebpackDevServer = require('webpack-dev-server');
import webpack = require('webpack');
import config from '../webpack/development.config';
import merge from 'webpack-merge';

const logging = require('webpack/lib/logging/runtime');
logging.configureDefaultLogger({
  level: 'error',
});

const server = new WebpackDevServer({
  ...config.devServer,
  client: {
    logging: 'none',
  },
  port: process.env.PORT ?? config.devServer?.port ?? 3000,
}, webpack(merge(config, {
  infrastructureLogging: {
    level: 'error'
  },
  stats: 'none',
})));

export default async function main () {
  await server.start();
}
