'use server';
import { SiteConfig } from '@/core/site-config';
import { sql, SqlInterface } from '@/utils/mysql';
import { revalidatePath } from 'next/cache';

export async function getSiteConfig (sql: SqlInterface) {
  const siteConfig = await sql.unique<{ site_config: SiteConfig }>`
      SELECT JSON_OBJECTAGG(name, value) AS site_config
      FROM site_config;
  `;

  if (!siteConfig) {
    throw new Error('bad state');
  }

  return siteConfig.site_config;
}

export async function togglePublicDataAccess () {
  await sql`
      UPDATE site_config
      SET value = IF(value, JSON_EXTRACT('false', '$'), JSON_EXTRACT('true', '$'))
      WHERE name = 'security.enable-public-data-access'
  `;

  revalidatePath('/admin/security');
}
