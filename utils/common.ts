export const ADMIN_DATABASE_NAME = process.env.NEXT_PUBLIC_SITE_DATABASE || 'ossinsight_lite_admin';

export function deepCloneJson<T> (v: T): T {
  return JSON.parse(JSON.stringify(v));
}
