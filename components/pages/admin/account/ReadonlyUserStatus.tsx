import { sql } from '@/utils/mysql';
import { use } from 'react';

export default function ReadonlyUserStatus () {
  const username = process.env.TIDB_USER;
  if (!username) {
    return <></>;
  }

  const readonlyUsername = username.replace(/\.[^.]*$/, '.osslreadonly');

  const found = use(sql.unique`
      SELECT *
      FROM mysql.user
      WHERE user = ${readonlyUsername}
  `);

  if (found) {
    return <span className="text-green-500">Created</span>;
  } else {
    return <span className="text-gray-400">Not found</span>;
  }
}
