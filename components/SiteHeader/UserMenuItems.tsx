import { logout } from '@/actions/auth';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import { isDemoSite } from '@/components/SiteHeader/utils';
import LoadingIndicator from '@/packages/ui/components/loading-indicator';
import authApi from '@/store/features/auth';
import BoxArrowInRightIcon from 'bootstrap-icons/icons/box-arrow-in-right.svg';

import BoxArrowRightIcon from 'bootstrap-icons/icons/box-arrow-right.svg';
import GearIcon from 'bootstrap-icons/icons/gear.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useTransition } from 'react';

export function UserMenuItems () {
  const router = useRouter();
  const { refetch, data, isLoading } = authApi.useReloadQuery();
  const { exitEditing } = useContext(DashboardContext);
  const [transitioning, startTransition] = useTransition();

  if (isDemoSite() && !data?.authenticated) {
    return (
      <a className="site-header-item site-demo-deploy" href="https://github.com/pingcap/ossinsight-lite#how-to-deploy-your-own-10mins" target="_blank">
        ✨ Deploy your own
      </a>
    );
  }

  if (isLoading || transitioning) {
    return (
      <span className="site-header-item">
        <LoadingIndicator />
      </span>
    );
  }

  if (data?.authenticated) {
    return (
      <>
        <Link className="site-header-item" href="/admin/dashboards" prefetch={false}>
          <GearIcon />
        </Link>
        <button className="site-header-item" onClick={() => startTransition(() => {
          return logout().then(async () => {
            exitEditing();
            await refetch();
            router.refresh();
          });
        })}>
          <BoxArrowRightIcon />
        </button>
      </>
    );
  } else {
    return (
      <>
        <Link className="site-header-item" href="/login-modal" prefetch={false}>
          <BoxArrowInRightIcon />
        </Link>
      </>
    );
  }
}