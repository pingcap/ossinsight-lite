import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import config from '@/.osswrc.json';
import { Suspense, use } from 'react';

const db = config.db.find(db => db.display === 'github-personal')!;
const dbName = process.env[db.env] || db.database;

export default function GithubPersonalStatus () {

  return (
    <section>
      <h3>Github personal datasource status</h3>
      <p>
        Database Name: <b>{dbName}</b>
      </p>
      <p>
        Current User: <Suspense fallback={'loading...'}><CurrentUser /></Suspense>
      </p>
    </section>
  );
}

function CurrentUser () {
  const rows = use(withConnection(getDatabaseUri(dbName), async ({ sql }) => (
    sql<{ login: string }>`SELECT login
                           FROM curr_user;`
  )));

  return <b>@{rows.map(row => row.login).join(', ')}</b>;
}