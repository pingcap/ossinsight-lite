import { cosmiconfig } from 'cosmiconfig';
import * as yup from 'yup';

const configSchema = yup.object({
  db: yup.array(yup.object({
    name: yup.string().required(),
    display: yup.string().required(),
    type: yup.string().oneOf(['mysql']).required(),
    database: yup.string().required(),
    env: yup.string().required(),
  })),
});

export type Config = ReturnType<typeof configSchema['validateSync']>;

let resolvedConfig: Config & { __filename?: string } | null;

export async function getConfig () {
  if (resolvedConfig) {
    return resolvedConfig;
  }

  const res = await cosmiconfig('ossw').search(process.cwd());

  const rawConfig = { ...res?.config };

  resolvedConfig = await configSchema.validate(rawConfig);
  resolvedConfig.__filename = res?.filepath;

  return resolvedConfig;
}
