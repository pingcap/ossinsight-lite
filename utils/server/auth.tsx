import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export const ADMIN_DATABASE_NAME = 'ossinsight_lite_admin';
export const SALT_ROUNDS = 6;

export function isReadonly (req?: NextRequest) {
  return ((req?.headers ?? headers()).get('X-Readonly') === 'true');
}
