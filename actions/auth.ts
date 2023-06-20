'use server';
import { getSiteConfig } from '@/actions/site';
import { isDev } from '@/packages/ui/utils/dev';
import { SiteWarnings } from '@/store/common/warnings';
import { sign } from '@/utils/jwt';
import { getDatabaseUri, SqlExecutor, withConnection } from '@/utils/mysql';
import { ADMIN_DATABASE_NAME, SALT_ROUNDS } from '@/utils/server/auth';
import { isNonEmptyString } from '@/utils/types';
import { compare, hash } from 'bcrypt-ts';
import { revalidatePath } from 'next/cache';
import { RequestCookies, ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout () {
  (cookies() as unknown as RequestCookies).delete('auth');
}

async function authenticate ({ sql }: SqlExecutor, username: string, password: string) {
  const user = await sql.unique<{ username: string, password: string }>`
      SELECT *
      FROM site_accounts
      WHERE username = ${username}
  `;

  if (user == null) {
    return false;
  }
  return await compare(password, user.password);
}

export async function loginAction (form: FormData) {
  'use server';
  await coreLoginAction(form);
  const redirectUri = (form.get('redirect_uri') as string) ?? '/';
  redirect(redirectUri);
}

export async function coreLoginAction (form: FormData) {
  'use server';
  const username = form.get('username') || 'admin';
  const password = form.get('password');
  const redirectUri = form.get('redirect_uri') as string;

  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error('Bad credential');
  }

  const siteConfig = await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async conn => {
    if (!await authenticate(conn, username, password)) {
      throw new Error('Bad credential');
    }
    return await getSiteConfig(conn.sql);
  });

  cookies().set({
    name: 'auth',
    value: await sign({ sub: username }, siteConfig['security.jwt.secret']),
    path: '/',
    secure: !isDev,
    sameSite: 'strict',
    maxAge: parseInt(process.env.JWT_MAX_AGE || '1800') + 300,
  } as ResponseCookie);

  const warnings: SiteWarnings[] = [];

  if (password === 'tidbcloud') {
    warnings.push(SiteWarnings.NEED_RESET_PASSWORD);
  }

  if (warnings.length > 0) {
    cookies().set({
      name: 'ossinsight-lite.site-warnings',
      value: warnings.join(','),
      path: '/',
      httpOnly: false,
      secure: !isDev,
      sameSite: 'strict',
    });
  } else {
    cookies().delete('ossinsight-lite.site-warnings');
  }

  if (redirectUri) {
    revalidatePath(redirectUri);
  }
}

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
    if (!await authenticate({ sql }, 'admin', oldPassword)) {
      throw new Error('Bad credential');
    }

    await sql`
        UPDATE site_accounts
        SET password = ${await hash(newPassword, SALT_ROUNDS)}
        WHERE username = 'admin';
    `;
  });
}

export async function recreateReadonlyUser () {
  const username = process.env.TIDB_USER;
  const password = process.env.TIDB_PASSWORD;
  if (!username || !password) {
    throw new Error('Bad state');
  }

  const readonlyUsername = username.replace(/\.[^.]*$/, '.osslreadonly');
  const readonlyPassword = password + '.osslreadonly';

  await withConnection(getDatabaseUri(), async ({ sql }) => {
    await sql`
        DROP USER IF EXISTS ${readonlyUsername}@'%';
    `;

    await sql`
        CREATE USER ${readonlyUsername}@'%' IDENTIFIED BY ${readonlyPassword};
    `;

    await sql`
        GRANT SELECT, SHOW DATABASES, SHOW VIEW ON *.* TO ${readonlyUsername}@'%';
    `;

    await sql`
        FLUSH PRIVILEGES;
    `;
  });

  revalidatePath('/admin/account');
}

export async function deleteReadonlyUser () {
  const username = process.env.TIDB_USER;
  const password = process.env.TIDB_PASSWORD;
  if (!username || !password) {
    throw new Error('Bad state');
  }

  const readonlyUsername = username.replace(/\.[^.]*$/, '.osslreadonly');

  await withConnection(getDatabaseUri(), async ({ sql }) => {
    await sql`
        DROP USER IF EXISTS ${readonlyUsername}@'%';
    `;
    await sql`
        FLUSH PRIVILEGES;
    `;
  });

  revalidatePath('/admin/account');
}
