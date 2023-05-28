import { getDatabaseUri, withConnection } from '@/utils/mysql';
// SEE https://github.com/vercel/next.js/issues/49759
// import { compare, hash } from 'bcrypt';
import { compare } from 'bcrypt-ts';
import { RowDataPacket } from 'mysql2/promise';

export const ADMIN_DATABASE_NAME = 'ossinsight_lite_admin';
export const SALT_ROUNDS = 6;
