import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import config from '@/.osswrc.json';
import { Suspense, use } from 'react';

const db = config.db.find(db => db.display === 'github-repo')!;
const dbName = process.env[db.env] || db.database;

export default function GithubRepoStatus () {

  return (
    <section>
      <h3>Github repo datasource status</h3>
      <p>
        Database Name: <b>{dbName}</b>
      </p>
      <p>
        Current tracking repos: <Suspense fallback={'loading...'}><CurrentUser /></Suspense>
      </p>
    </section>
  );
}

function CurrentUser () {
  const rows = use(withConnection(getDatabaseUri(dbName), async ({ sql }) => (
    sql<{ full_name: string }>`SELECT full_name
                           FROM repo_full_name_configs;`
  )));

  return <b>{rows.map(row => row.full_name).join(', ')}</b>;
}