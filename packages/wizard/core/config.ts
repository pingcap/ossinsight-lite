import { object, string } from 'yup';
import { cosmiconfig } from 'cosmiconfig';
import { withOra } from './cli-utils.js';
import chalk from 'chalk';

const configSchema = object({
  github: object({
    accessToken: string().required(),
    pipeline: object({
      ohMyGithub: string().default('oh-my-github-pipeline'),
      trackRepo: string().default('track-repo-pipeline'),
    }),
  }).default({}),
  vercel: object({
    team: string().required(),
    accessToken: string().required(),
  }),
  tidbcloud: object({
    publicKey: string().required(),
    privateKey: string().required(),
    project: string().default('default project'),
  }),
});

export type Config = (typeof configSchema)['__outputType'];

async function getConfig (): Promise<{ config: Config, file: string }> {
  const res = await cosmiconfig('widgets-wizard').search();
  if (res) {
    const config = await configSchema.validate(res.config);
    return {
      config,
      file: res.filepath,
    };
  }
  await configSchema.validate({});
  throw new Error('never');
}

const TAG = chalk.bold(`[config]`);

const { config } = await withOra(
  `${TAG} loading...`,
  ({ file }) => `${TAG} located at ${chalk.gray(file)}`,
  err => `${TAG} failed: ${String(err)}`,
  getConfig,
);

export default config;
