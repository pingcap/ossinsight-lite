import { launch } from 'puppeteer-core';
import serve, { waitAvailable } from './serve.js';
import getPort from 'get-port';
import { cwd } from '../webpack/utils/path.js';
import { getSources } from '../webpack/utils/widgets.js';
import { Browser, BrowserPlatform, computeExecutablePath, detectBrowserPlatform, resolveBuildId } from '@puppeteer/browsers';
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/esm/puppeteer/revisions.js';
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
    cacheDir: cwd('.cache/puppeteer'),
    buildId: await resolveBuildId(Browser.CHROMIUM, platform, PUPPETEER_REVISIONS.chromium),
    platform,
  };

  const port = await getPort();
  const origin = `http://127.0.0.1:${port}`;
  const serveProcess = serve(port, true);

  try {
    const browserPromise = launch({
      executablePath: computeExecutablePath(options),
      product: 'chrome',
      headless: 'new',
      args: [
        '--disable-web-security',
      ],
      defaultViewport: {
        width: 800,
        height: 418,
        deviceScaleFactor: 1,
      },
    });

    const [browser] = await Promise.all([browserPromise, waitAvailable(port)]);
    const page = (await browser.pages())[0];

    async function take (name: string) {
      await page.setContent(getHtmlContent(origin, name));
      await page.waitForFunction('__OSSW_PRERENDER_DONE__');
      await page.waitForNetworkIdle();
      await page.screenshot({
        path: cwd(`page-dist/widgets/${name}/thumbnail.png`),
      });
    }

    for (const entry of Object.keys(getSources())) {
      await take(entry.replace(/\/index$/, ''));
    }

    await browser.close();
  } catch (e) {
    throw e;
  } finally {
    serveProcess.abort('shutdown');
  }
}

const getHtmlContent = (origin: string, widget: string) => `
  <!doctype>
  <html lang="en">
  <head>
    <title></title>
    <style>
      html, body {
        padding: 0;
        margin: 0;
      }
    </style>
    <link rel="stylesheet" href="${origin}/widgets/style.css">
    <link rel="stylesheet" href="${origin}/widgets/${widget}/style.css">
  </head>
  <body>
  <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <div
    class="widget"
    id="widget"
    style="display: flex; align-items: center; justify-content: center; min-height: 100vh">
  </div>
  <script>
    window.__OSSW_MODE__ = 'prerender'
    window.__OSSW_PRERENDER_DONE__ = true;
  </script>
  <script type="module">
    import Widget from '${origin}/widgets/${widget}/index.js'

    ReactDOM
      .createRoot(document.getElementById('widget'))
      .render(React.createElement(Widget, {
        style: {
          width: 800,
          height: 418,
        }
      }))
  </script>
  </body>
  </html>
`;
