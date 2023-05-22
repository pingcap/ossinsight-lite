import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import { Connection, RowDataPacket } from 'mysql2/promise';
import { hash } from 'bcrypt-ts';
import { ADMIN_DATABASE_NAME, INITIAL_PASSWORD, SALT_ROUNDS } from '@/src/auth';

export async function migrate () {
  const uri = getDatabaseUri();
  await withConnection(uri, async conn => {
    if (!await isDatabaseExists(conn, ADMIN_DATABASE_NAME)) {
      await conn.execute(`
        CREATE DATABASE \`${ADMIN_DATABASE_NAME}\`;
      `);
    }
    await conn.execute(`
      USE \`${ADMIN_DATABASE_NAME}\`;
    `);

    if (!await isTableExists(conn, 'site_accounts')) {
      await conn.execute(`
          CREATE TABLE site_accounts
          (
              username VARCHAR(255) PRIMARY KEY NOT NULL,
              password CHAR(72)                 NOT NULL
          );
      `);

      await conn.execute(`
          INSERT INTO site_accounts (username, password)
          VALUES (?, ?)
      `, ['admin', await hash(INITIAL_PASSWORD, SALT_ROUNDS)]);
    }
  });
}

async function isDatabaseExists (conn: Connection, name: string) {
  const [databases, fields] = await conn.execute<[RowDataPacket]>('SHOW DATABASES;');
  return databases.findIndex(entry => entry[fields[0].name] === name) !== -1;
}

async function isTableExists (conn: Connection, name: string) {
  const [databases, fields] = await conn.execute<[RowDataPacket]>('SHOW TABLES;');
  return databases.findIndex(entry => entry[fields[0].name] === name) !== -1;
}

