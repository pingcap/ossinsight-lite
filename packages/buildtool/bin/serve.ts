import { buildtoolSrc, cwd } from '../webpack/utils/path.js';
import { spawn } from './utils/cp.js';
import { clearInterval } from 'timers';

export default function main (port = 3001, detached = false) {
  return spawn(buildtoolSrc('node_modules/.bin/serve'), ['-l', String(port), '--cors', cwd('page-dist')], detached);
}

const fetch = (global as any).fetch;

export async function waitAvailable (port = 3001, timeout = 30000, interval = 1000) {
  async function test (signal: AbortSignal) {
    const resp = await fetch(`http://127.0.0.1:${port}/`, { signal });
    try {
      return resp.ok;
    } catch {
      return false;
    }
  }

  return new Promise<void>((resolve, reject) => {
    const controller = new AbortController();

    const timer = setInterval(async () => {
      const res = await test(controller.signal);
      if (res) {
        clearInterval(timer);
        clearTimeout(timeoutTimer);
        resolve();
      }
    }, interval);

    const timeoutTimer = setTimeout(() => {
      clearInterval(timer);
      const err = new Error('timeout');
      controller.abort(err);
      reject(err);
    }, timeout);
  });
}
