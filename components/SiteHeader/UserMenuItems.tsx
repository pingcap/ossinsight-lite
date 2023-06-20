import { DashboardContext } from '@/components/pages/Dashboard/context';
import UserAvatar from '@/components/SiteHeader/UserAvatar';
import { isDemoSite } from '@/components/SiteHeader/utils';
import LoadingIndicator from '@/packages/ui/components/loading-indicator';
import authApi from '@/store/features/auth';
import BoxArrowInRightIcon from 'bootstrap-icons/icons/box-arrow-in-right.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useTransition } from 'react';

export function UserMenuItems ({ contentGroup }: { contentGroup: string }) {
  const router = useRouter();
  const { refetch, data, isLoading } = authApi.useReloadQuery();
  const { exitEditing } = useContext(DashboardContext);
  const [transitioning, startTransition] = useTransition();

  if (isDemoSite() && !data?.authenticated) {
    return <span className='block mr-16 site-header-item-optional'></span>;
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
      <UserAvatar contentGroup={contentGroup} />
    );
  } else if (contentGroup !== 'public') {
    return (
      <>
        <Link className="site-header-item" href="/login-modal" prefetch={false}>
          <BoxArrowInRightIcon />
        </Link>
      </>
    );
  } else {
    return null;
  }
}