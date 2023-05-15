import { Fixup, Version } from './type.ts';

export interface VersionedDataOptions {
  versions: Version[];
  fixup?: Record<string | number, Fixup>;
}

export function migrate<T> (data: any, { versions, fixup = {} }: VersionedDataOptions): T {
  let i = -1;
  if (!data?.version) {
    i = 0;
    console.debug('no version found, try to migrate config to version 0');
    data = versions[0].migrate(data);
    if (fixup[0]) {
      data = fixup[0](data);
    }
  } else {
    i = versions.findIndex(version => version.version === data.version);
  }

  if (i === -1) {
    throw new Error(`Unknown version ${data.version}`);
  }

  if (i === versions.length - 1) {
    if (fixup[versions[i].version]) {
      data = fixup[versions[i].version](data);
    }
    return data;
  }

  return versions.slice(i + 1).reduce((prev, curr) => {
    console.debug('migrate config to', curr.version);
    let res = curr.migrate(prev);
    if (fixup[curr.version]) {
      res = fixup[curr.version](res);
    }
    return res;
  }, data);
}
