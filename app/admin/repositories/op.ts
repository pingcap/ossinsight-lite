import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import { OkPacket } from 'mysql2';
import config from '@/.osswrc.json';

const repoTrackDb = config.db.find(db => db.display === 'github-repo')!;

const dbName = process.env[repoTrackDb.env] || repoTrackDb.database;

export async function getTrackingRepos () {
  const [rows] = await withConnection(getDatabaseUri(dbName), (conn) => {
    return conn.query('SELECT * FROM repo_full_name_configs;');
  });

  return rows as { id: string, full_name: string }[];
}

export async function addTrackingRepo (repoName: string) {
  const res = await fetch(`https://api.github.com/repos/${repoName}`);
  if (!res.ok) {
    throw new Error(`${repoName} not exists`);
  }

  const [ok] = await withConnection(getDatabaseUri(dbName), conn =>
    conn.execute<OkPacket>('INSERT INTO repo_full_name_configs (full_name) VALUES (?)', [repoName]),
  );

  if (ok.affectedRows !== 1) {
    throw new Error('Insertion failed.');
  }
}

export async function deleteTrackingRepo (repoName: string) {
  const [ok] = await withConnection(URI, conn => (
    conn.execute<OkPacket>('DELETE FROM repo_full_name_configs WHERE full_name = ?', [repoName])
  ));

  if (ok.affectedRows !== 1) {
    throw new Error('Deletion failed.');
  }
}
