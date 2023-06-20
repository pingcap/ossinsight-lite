import { getSiteConfig } from '@/actions/site';
import { PublicDataAccessControl } from '@/components/pages/admin/security/form';
import { sql } from '@/utils/mysql';

export default async function Page () {
  const siteConfig = await getSiteConfig(sql);

  if (!siteConfig) {
    throw new Error('Bad site settings.');
  }

  return (
    <div className="max-w-screen-md">
      <h2>Critical Settings</h2>
      <PublicDataAccessControl enabled={siteConfig['security.enable-public-data-access']} />
    </div>
  );
}
