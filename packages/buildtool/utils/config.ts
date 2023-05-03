import { cosmiconfig } from 'cosmiconfig';
import * as yup from 'yup';

const configSchema = yup.object({
  siteDomain: yup.string().required(),
  db: yup.array(yup.object({
    name: yup.string().required(),
    type: yup.string().oneOf(['mysql']).required(),
    env: yup.string().required(),
  })),
});

let resolvedConfig: ReturnType<typeof configSchema['validateSync']> | null;

export async function getConfig () {
  if (resolvedConfig) {
    return resolvedConfig;
  }

  const res = await cosmiconfig('ossw').search(process.cwd());

  const rawConfig = { ...res?.config };
  const config = await configSchema.validate(rawConfig);

  resolvedConfig = config;

  return config;
}