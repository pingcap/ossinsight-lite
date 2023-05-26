import { getDatabaseUri, withConnection } from '@/utils/mysql';
// SEE https://github.com/vercel/next.js/issues/49759
// import { compare, hash } from 'bcrypt';
import { compare } from 'bcrypt-ts';
import { RowDataPacket } from 'mysql2/promise';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_DATABASE_NAME = 'ossinsight_lite_admin';
export const INITIAL_PASSWORD = process.env.ADMIN_PASSWORD ?? 'tidbcloud';
export const SALT_ROUNDS = 6;

export async function authenticate (username: string, password: string) {
  return withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async conn => {
    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM site_accounts WHERE username = ?', [username]);
    if (rows.length !== 1) {
      return false;
    }
    return await compare(password, rows[0].password);
  });
}

export async function authenticateApiGuard (req: NextRequest) {
  const auth = req.cookies.get('auth')?.value;
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const [bu, bp] = auth.split(':');
  const username = Buffer.from(bu, 'base64url').toString('utf-8');
  const password = Buffer.from(bp, 'base64url').toString('utf-8');

  try {
    if (!await authenticate(username, password)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (e: any) {
    if (e?.isNoConnectionError) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 400 });
    }
    throw e;
  }
}

export async function authenticateGuard (redirectUri: string) {
  const auth = cookies().get('auth')?.value;

  if (!auth) {
    redirect(`/login?redirect_uri=${encodeURIComponent(redirectUri)}`);
  }

  const [bu, bp] = auth.split(':');
  const username = Buffer.from(bu, 'base64url').toString('utf-8');
  const password = Buffer.from(bp, 'base64url').toString('utf-8');

  try {
    if (!await authenticate(username, password)) {
      redirect(`/login?redirect_uri=${encodeURIComponent(redirectUri)}`);
    }
  } catch (e: any) {
    if (e?.isNoConnectionError) {
      redirect(`/admin/status`);
    }
  }
}