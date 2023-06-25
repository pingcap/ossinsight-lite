export interface RemoteInfo {
  owner: string;
  repo: string;
  branch: string;
  name: string;
}

export type ConfigJson = {
  'min-ossl-version': number
  title: string
  description: string
  keywords?: string[]
  database: string
  vis: 'chart.js'
}

export function basePath ({ owner, repo, branch, name }: RemoteInfo) {
  return `/api/collections/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${name}/`;
}

export function getGithubContentUrl ({ owner, repo, branch, name }: RemoteInfo) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/collections/${name}/`;
}
