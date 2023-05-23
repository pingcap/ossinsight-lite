import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import config from '@/.osswrc.json';
import { Suspense, use } from 'react';

const db = config.db.find(db => db.display === 'github-personal')!;
const dbName = process.env[db.env] || db.database;

export default function GithubPersonalStatus () {

  return (
    <section>
      <h3>Github personal datasource status</h3>
      <table className="data-table kv-table table-auto">
        <tbody>
        <tr>
          <td>
            Database Name
          </td>
          <td>
            <b>{dbName}</b>
          </td>
        </tr>
        <tr>
          <td>
            Schema Version
          </td>
          <td>
            <Suspense fallback={'loading...'}><SchemaVersion /></Suspense>
          </td>
        </tr>
        <tr>
          <td>
            Current User
          </td>
          <td>
            <Suspense fallback={'loading...'}><CurrentUser /></Suspense>
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  );
}

function CurrentUser () {
  const rows = use(withConnection(getDatabaseUri(dbName), async ({ sql }) => (
    sql<{ login: string }>`
        SELECT login
        FROM curr_user;`
  )));

  return <b>@{rows.map(row => row.login).join(', ')}</b>;
}

function SchemaVersion () {
  const rows = use(withConnection(getDatabaseUri(dbName), async ({ sql }) => (
    sql<{ version: string }>`
        SELECT version
        FROM schema_migrations
        ORDER BY version DESC
        LIMIT 1;`
  )));

  return <b>{rows[0].version}</b>;
}