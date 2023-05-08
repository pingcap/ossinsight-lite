import { webpack } from './utils/cp.js';
import { getConfig } from '../utils/config.js';

interface Options {
  siteDomain?: string;
}

export default async function main (options: Options = {}) {
  options = { ...options };
  Object.keys(options).forEach((key) => {
    if ((options as any)[key] == null) {
      delete (options as any)[key];
    }
  });

  const { __filename, ...config } = { ...await getConfig(), ...options };

  await webpack('page', {
    'OSSW_SITE_DOMAIN': config.siteDomain,
  });
}
