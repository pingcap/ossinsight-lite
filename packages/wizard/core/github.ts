import { Octokit } from '@octokit/rest';
import config from './config.js';
import { OctokitResponse } from '@octokit/types';
import chalk from 'chalk';
import { withOra } from './cli-utils.js';
import { getErrorMessage } from './utils.js';

async function assertOk<T> (promise: Promise<OctokitResponse<T>>) {
  const octokitResponse = await promise;
  if (octokitResponse.status !== 200) {
    console.error(octokitResponse);
    throw new Error(`Failed to perform octokit request ${octokitResponse.status}`);
  }
  if (!octokitResponse.data) {
    throw new Error('No response data');
  }
  return octokitResponse.data;
}

async function optional<T> (promise: Promise<OctokitResponse<T>>): Promise<T | null> {
  try {
    const octokitResponse = await promise;
    return octokitResponse.data;
  } catch (e) {
    return null;
  }
}

const client = new Octokit({
  auth: config.github.accessToken,
});

const LOG_TAG = chalk.bold('[github]');

const user = await withOra(
  `${LOG_TAG} authenticating...`,
  user => `${LOG_TAG} authenticated as user ${chalk.bold.cyan(user.login)}`,
  getErrorMessage,
  () => assertOk(client.users.getAuthenticated()),
);

const { login } = user;

export async function getProjectInfo (projectName: string) {
  return await optional(client.repos.get({
    owner: login,
    repo: projectName,
  }));
}

export async function getProjectSecrets (projectName: string) {
  return await assertOk(client.actions.listRepoSecrets({
    owner: login,
    repo: projectName,
  }));
}

export async function getProjectAction (projectName: string) {
  return await assertOk(client.actions.listWorkflowRunsForRepo({
    owner: login,
    repo: projectName,
    status: 'completed',
    per_page: 1,
  }));
}
