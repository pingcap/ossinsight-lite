import cp from 'child_process';
import { webpackBuildSrc } from '../../webpack/utils/path';
import Webpack, { Configuration } from 'webpack';
import merge from 'webpack-merge';

export async function spawn (name: string, args: string[], env?: Record<string, string>) {
  return new Promise<void>((resolve, reject) => {
      cp.spawn(name, args, {
        stdio: 'inherit',
        env,
      })
        .on('error', err => {
          reject(err);
        })
        .on('close', (code) => {
          if (!code) {
            resolve();
          } else {
            process.exit(code);
          }
        });
    },
  );
}

export async function webpack (config: string, env?: Record<string, string>) {
  console.log('[webpack]', config);

  const conf = require(webpackBuildSrc(`${config}.config.js`)).default;
  return new Promise<void>((resolve, reject) => {
    Webpack(merge(conf, {
      plugins: [
        new Webpack.EnvironmentPlugin(env ?? {}),
      ],
    } satisfies  Configuration), (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats) {
        if (stats.hasWarnings()) {
          stats.compilation.getWarnings().forEach(warning => {
            console.warn(warning.message);
          });
        }
        if (stats.hasErrors()) {
          stats.compilation.getErrors().forEach(error => {
            console.error(error.message);
          });
        }
        resolve();
      }
    });
  });
}
