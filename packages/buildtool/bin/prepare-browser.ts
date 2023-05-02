import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/esm/puppeteer/revisions.js';
import { launch } from 'puppeteer-core';
import { Browser, BrowserPlatform, computeExecutablePath, detectBrowserPlatform, install, resolveBuildId } from '@puppeteer/browsers';
import * as fs from 'fs';
import path from 'path';

export default async function main () {
  let platform = detectBrowserPlatform();

  if (!platform) {
    throw new Error('Cannot detect platform');
  }
  if (platform === BrowserPlatform.MAC_ARM) {
    platform = BrowserPlatform.MAC;
  }

  const options = {
    browser: Browser.CHROMIUM,
    cacheDir: '.cache/puppeteer',
    buildId: await resolveBuildId(Browser.CHROMIUM, platform, PUPPETEER_REVISIONS.chromium),
    platform,
  };

  const executablePath = computeExecutablePath(options);

  if (fs.existsSync(executablePath)) {
    console.log(`Browser already prepared at: ${path.relative(process.cwd(), executablePath)}`);
    return;
  } else {
    console.log('Installing chrome...');
    // const installedBrowser = await install(options);
    // console.log('Installed browser', installedBrowser);
  }
}
