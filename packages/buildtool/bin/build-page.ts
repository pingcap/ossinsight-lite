import { webpack } from './utils/cp';
import * as yup from 'yup';
import { cosmiconfig } from 'cosmiconfig';

interface Options {
  siteDomain?: string;
}

export default async function main (options: Options = {}) {
  const configSchema = yup.object({
    siteDomain: yup.string().required(),
  });

  const res = await cosmiconfig('ossw').search(process.cwd());

  options = { ...options };
  Object.keys(options).forEach((key) => {
    if ((options as any)[key] == null) {
      delete (options as any)[key];
    }
  });

  const rawConfig = { ...res?.config, ...options };
  const config = await configSchema.validate(rawConfig);

  await webpack('page', {
    'OSSW_SITE_DOMAIN': config.siteDomain,
  });
}
