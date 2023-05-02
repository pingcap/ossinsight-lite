import { createRequire } from 'module';

const require = createRequire(process.cwd());
export default async function main () {
  require('puppeteer/install.js');
}