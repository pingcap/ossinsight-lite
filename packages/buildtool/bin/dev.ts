import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import config from '../webpack/development.config.js';
import { merge } from 'webpack-merge';
import Webpack from 'webpack';
// @ts-ignore
import logging from 'webpack/lib/logging/runtime.js';
import { tryImport } from './utils/cp.js';

logging.configureDefaultLogger({
  level: 'error',
});

const port = process.env.PORT ?? config.devServer?.port ?? 3000;

export default async function main () {
  const clientConfig = (await tryImport('webpack.config.js'))?.default
  const server = new WebpackDevServer({
    ...config.devServer,
    client: {
      logging: 'none',
    },
    port,
  }, webpack(merge(config, { ...clientConfig }, {
    plugins: [
      new Webpack.EnvironmentPlugin({
        OSSW_SITE_DOMAIN: `http://localhost:${process.env.__VERCEL_DEV_RUNNING ? '3000' : port}`,
      }),
    ],
    infrastructureLogging: {
      level: 'error',
    },
    stats: 'none',
  })));

  await server.start();
}
