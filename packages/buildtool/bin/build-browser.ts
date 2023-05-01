import { webpack } from './utils/cp';

export default async function main () {
  await webpack('browser');
}
