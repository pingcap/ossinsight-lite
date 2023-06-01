import { createCache } from './cache';

const { getCache, setCache } = createCache('db/sql');

export async function doDbSqlQuery (prop: { sql: string, db: string, force: boolean, use?: string }, signal?: AbortSignal): Promise<any> {
  let invalidCache;
  if (!prop.force) {
    const data = await getCache(prop.db, prop.sql, prop.use || '');
    if (data && (!isFinite(data.expired) || data.expired > Date.now())) {
      return data;
    }
    invalidCache = data;
  }

  const res = await fetch(`/api/db/${prop.db}?force=${prop.force}&use=${prop.use ?? ''}`, {
    method: 'post',
    body: prop.sql,
    signal,
  });
  if (res.ok) {
    const data = await res.json();
    if (isFinite(data.ttl)) {
      data.expired = Date.now() + data.ttl * 1000;
    }
    await setCache(prop.db, prop.sql, prop.use || '', data);
    return data;
  } else {
    try {
      if (invalidCache) {
        return invalidCache;
      }
      const response = await res.json();
      return Promise.reject(new Error(response?.message ?? JSON.stringify(response)));
    } catch {
      return Promise.reject(new Error(`${res.status} ${res.statusText}`));
    }
  }
}
