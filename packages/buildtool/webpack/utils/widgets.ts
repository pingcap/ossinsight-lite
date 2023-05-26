import { glob } from 'glob';
import * as path from 'node:path';

export function getSources () {
  const files: Record<string, string> = {};
  const paths = glob.sync('src/widgets/**/index.ts');

  paths.forEach(fn => {
    files[fn.replace(/\.ts$/, '').replace('src/widgets/', '')] = path.resolve(process.cwd(), fn);
  });

  return files;
}

export function getStyles () {
  const files: Record<string, string> = {};
  const paths = glob.sync('src/widgets/**/index.css');

  paths.forEach(fn => {
    files[fn.replace(/index\.css$/, 'style').replace('src/widgets/', '')] = path.resolve(process.cwd(), fn);
  });

  return files;
}
