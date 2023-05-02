import { webpack } from './utils/cp.js';

export default async function main () {
  await webpack('browser');
}
