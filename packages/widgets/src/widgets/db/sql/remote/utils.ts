
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
  database: string
  vis: 'chart.js'
}

export function basePath ({ owner, repo, branch, name }: RemoteInfo) {
  return `/api/collections/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${name}/`;
}
