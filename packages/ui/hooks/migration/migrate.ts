import { Version } from './type.ts';

export interface VersionedDataOptions {
  versions: Version[];
}

export function migrate<T> (data: any, { versions }: VersionedDataOptions): T {
  let i = -1;
  if (!data?.version) {
    i = 0;
    console.debug('no version found, try to migrate config to version 0');
    data = versions[0].migrate(data);
  } else {
    i = versions.findIndex(version => version.version === data.version);
  }

  if (i === -1) {
    throw new Error(`Unknown version ${data.version}`);
  }

  return versions.slice(i + 1).reduce((prev, curr) => {
    console.debug('migrate config to', curr.version)
    return curr.migrate(prev);
  }, data);
}
