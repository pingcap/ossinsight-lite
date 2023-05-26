function promisify<T> (request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

export function createCache (name: string) {
  const request = indexedDB.open(`cache:${name}`);

  request.onupgradeneeded = ev => {
    const db = request.result;
    db.createObjectStore('main');
  };

  const database = promisify(request);

  async function getCache (db: string, sql: string, use?: string) {
    const tx = (await database).transaction('main');
    const main = tx.objectStore('main');
    const res = await promisify(main.get(`${db}:${use}:${sql}`));
    tx.commit();
    return res;
  }

  async function setCache (db: string, sql: string, use: string, result: any) {
    const tx = (await database).transaction('main', 'readwrite');
    const main = tx.objectStore('main');
    await promisify(main.put(result, `${db}:${use}:${sql}`));
    tx.commit();
  }

  return {
    getCache,
    setCache,
  };
}
