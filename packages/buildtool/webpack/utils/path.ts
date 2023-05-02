import * as path from 'path';
import * as process from 'process';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BUILDTOOL_ROOT = path.resolve(__dirname, '../../..');

export function devappSrc (src: string) {
  return path.join(BUILDTOOL_ROOT, '../devapp/src', src)
}

export function buildtoolSrc (src: string) {
  return path.join(BUILDTOOL_ROOT, src);
}

export function webpackBuildSrc (src: string) {
  return path.join(BUILDTOOL_ROOT, 'dist/webpack', src);
}

export function cwd (src: string) {
  return path.join(process.cwd(), src);
}
