'use server';
import { isNonEmptyString } from '@/src/utils/types';
import { getDatabaseUri, withConnection } from '@/src/utils/mysql';
import { ADMIN_DATABASE_NAME, SALT_ROUNDS } from '@/src/auth';
import { compare, hash } from 'bcrypt-ts';

export async function resetPasswordAction (formData: FormData) {
  const oldPassword = formData.get('old-password');
  const newPassword = formData.get('password');
  const repeatPassword = formData.get('repeat-password');

  if (!isNonEmptyString(oldPassword)) {
    throw new Error('bad old password');
  }

  if (!isNonEmptyString(newPassword)) {
    throw new Error('bad new password');
  }

  if (!isNonEmptyString(repeatPassword)) {
    throw new Error('bad repeat password');
  }

  if (newPassword !== repeatPassword) {
    throw new Error('passwords not identical');
  }

  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql, beginTransaction }) => {
    await beginTransaction();
    const rows = await sql<{ password: string }>`
          SELECT password
          FROM site_accounts
          WHERE username = 'admin';
      `;

    if (rows.length !== 1) {
      throw new Error('Bad credential');
    }
    await compare(oldPassword, rows[0].password);

    await sql`
          UPDATE site_accounts
          SET password = ${await hash(newPassword, SALT_ROUNDS)}
          WHERE username = 'admin';
      `;
  });

}