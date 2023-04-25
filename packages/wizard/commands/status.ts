import type { SubCommand } from './cli-common.js';
import config, { Config } from '../core/config.js';
import { getProjectAction, getProjectInfo, getProjectSecrets } from '../core/github.js';
import { withOra } from '../core/cli-utils.js';
import { getErrorMessage } from '../core/utils.js';
import chalk from 'chalk';

const status: SubCommand<[], {}> = async () => {
  await pipelineStatus('oh-my-github', 'ohMyGithub');
  await pipelineStatus('track-repo', 'trackRepo');
};

async function pipelineStatus (name: string, pipeline: keyof Config['github']['pipeline']) {
  const repo = await pipelineRepo(name, pipeline);

  if (repo) {
    await pipelineSecrets(name, pipeline);
    await pipelineActions(name, pipeline);
  }

  return repo;
}

async function pipelineRepo (name: string, pipeline: keyof Config['github']['pipeline']) {
  const TAG = chalk.bold(`[pipeline:${name}]`);
  const repo = config.github.pipeline[pipeline];
  return await withOra(
    `${TAG} checking...`,
    info => {
      if (info) {
        return `${TAG} forked as ${info.url}`;
      } else {
        return ['warn', `${TAG} not forked`];
      }
    },
    err => `failed to check: ${getErrorMessage(err)}`,
    async () => await getProjectInfo(repo),
  );
}

async function pipelineSecrets (name: string, pipeline: keyof Config['github']['pipeline']) {
  const TAG = chalk.bold(`[pipeline:${name}]`);

  await withOra(
    `${TAG} check secrets...`,
    res => {
      const secrets = res.secrets.map(s => s.name).join(', ');
      return `${TAG} configured secrets: ${secrets}`;
    },
    e => `${TAG} failed to check secrets: ${e}`,
    () => getProjectSecrets(config.github.pipeline[pipeline]),
  );
}

async function pipelineActions (name: string, pipeline: keyof Config['github']['pipeline']) {
  const TAG = chalk.bold(`[pipeline:${name}]`);

  await withOra(
    `${TAG} check workflows...`,
    runs => {
      const run = runs.workflow_runs[0];
      if (run) {
        return `${TAG} last action executed at ${run.run_started_at}`;
      } else {
        return ['warn', `${TAG} workflow not executed`];
      }
    },
    e => `${TAG} failed to check workflow runs: ${e}`,
    () => getProjectAction(config.github.pipeline[pipeline]),
  );
}

export default status;
