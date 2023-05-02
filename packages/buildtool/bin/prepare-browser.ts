import { getConfiguration } from 'puppeteer/lib/esm/puppeteer/getConfiguration.js';
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

  const { cacheDirectory, browserRevision } = getConfiguration();

  const options = {
    browser: Browser.CHROMIUM,
    cacheDir: cacheDirectory ?? '.cache/puppeteer',
    buildId: await resolveBuildId(Browser.CHROMIUM, platform, browserRevision ?? 'latest').catch(() => '1108766'),
    platform,
  };

  const executablePath = computeExecutablePath(options);

  if (fs.existsSync(executablePath)) {
    console.log(`Browser already prepared at: ${path.relative(process.cwd(), executablePath)}`);
    return;
  } else {
    console.log('Installing chrome...');
    await install(options);
  }
}
