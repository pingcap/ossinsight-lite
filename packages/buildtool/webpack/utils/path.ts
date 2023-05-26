import * as path from 'path';
import * as process from 'process';

const BUILDTOOL_ROOT = path.resolve(__dirname, '../../..');

export function dep (src: string) {
  return path.join(BUILDTOOL_ROOT, 'node_modules', src);
}

export function devappSrc (src: string) {
  return dep(path.join('@ossinsight-lite/devapp/src', src));
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
