import { isDemoSite } from '@/components/SiteHeader/utils';
import { RepoForkedIcon } from '@primer/octicons-react';

export default function ForkMe () {
  return isDemoSite() ? (
    <a className="site-fork-me" href="https://github.com/pingcap/ossinsight-lite#how-to-deploy-your-own-10mins" target="_blank">
      <RepoForkedIcon />
      Fork me
    </a>
  ) : null;
}