import * as fsp from 'fs/promises';
import * as path from 'node:path';

export default class Cache {
  private readonly caches = new Map<string, any>();
  private readonly runningCaches = new Map<string, Promise<any>>();
  private readonly path: string;

  constructor (
    public readonly name: string,
    public readonly dir: string,
  ) {
    this.path = path.join(this.dir, this.name);
  }

  async prepare () {
    await fsp.mkdir(this.dir, { recursive: true });
  }

  async open () {
    try {
      await fsp.access(this.path);
    } catch {
      return;
    }
    try {
      const content = await fsp.readFile(this.path, { encoding: 'utf-8' });
      const obj = JSON.parse(content);
      if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => this.caches.set(key, value));
      }
    } catch {
    }
  }

  async write () {
    const obj: any = {};
    this.caches.forEach((value, key) => obj[key] = value);

    const content = JSON.stringify(obj, undefined, 2);
    await fsp.writeFile(this.path, content);
  }

  async close () {
  }

  async has (key: string) {
    return this.runningCaches.has(key) || this.caches.has(key);
  }

  async get<T> (key: string, runner: () => Promise<T>): Promise<T> {
    if (this.runningCaches.has(key)) {
      return this.runningCaches.get(key);
    }
    if (this.caches.has(key)) {
      return this.caches.get(key);
    }
    const promise = runner();
    this.runningCaches.set(key, promise);
    promise
      .then(async res => {
        if (!('__error__' in (res as any))) {
          this.caches.set(key, res);
        }
        await this.write();
      })
      .finally(() => {
        this.runningCaches.delete(key);
      });

    return promise;
  }
}