import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import config from '../webpack/development.config.js';
import { merge } from 'webpack-merge';
import Webpack from 'webpack';
// @ts-ignore
import logging from 'webpack/lib/logging/runtime.js';

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
