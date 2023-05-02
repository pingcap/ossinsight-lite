import { buildtoolSrc, cwd } from '../webpack/utils/path.js';
import { spawn } from './utils/cp.js';

export default async function main () {
  await spawn(buildtoolSrc('node_modules/.bin/serve'), ['-l', '3001', '--cors', cwd('page-dist')]);
}
