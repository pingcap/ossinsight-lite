const dbPromises = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('cache:db/sql');

  request.onsuccess = ev => {
    resolve(request.result);
  };

  request.onerror = ev => {
    reject(request.error);
  };

  request.onupgradeneeded = ev => {
    const db = request.result;
    db.createObjectStore('main');
  };
});

const database = await dbPromises;

export async function getCache (db: string, sql: string) {
  const tx = database.transaction('main');
  const main = tx.objectStore('main');
  const res = await new Promise<any>((resolve, reject) => {
    const req = main.get(`${db}:${sql}`);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  tx.commit();
  return res;
}

export async function setCache (db: string, sql: string, result: any) {
  const tx = database.transaction('main', 'readwrite');
  const main = tx.objectStore('main');
  await new Promise<void>((resolve, reject) => {
    const req = main.delete(`${db}:${sql}`);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  })
  await new Promise<void>((resolve, reject) => {
    const req = main.add(result, `${db}:${sql}`);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  tx.commit();
}
