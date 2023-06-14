'use client';

import { isDemoSite } from '@/components/SiteHeader/utils';
import authApi from '@/store/features/auth';
import { RepoForkedIcon } from '@primer/octicons-react';

export default function ForkMe () {
  const { data } = authApi.useReloadQuery();

  return (isDemoSite() && !data?.authenticated) ? (
    <a className="site-fork-me" href="https://github.com/pingcap/ossinsight-lite#how-to-deploy-your-own-10mins" target="_blank">
      <RepoForkedIcon />
      Fork me
    </a>
  ) : null;
}
