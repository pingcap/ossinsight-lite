import { logout } from '@/actions/auth';
import { DashboardContext } from '@/components/pages/Dashboard/context';
import AppContext from '@/packages/ui/context/app';
import authApi from '@/store/features/auth';
import * as RuiAvatar from '@radix-ui/react-avatar';
import * as Menubar from '@radix-ui/react-menubar';
import BoxArrowRightIcon from 'bootstrap-icons/icons/box-arrow-right.svg';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg';
import GearIcon from 'bootstrap-icons/icons/gear.svg';
import { useRouter } from 'next/navigation';
import { startTransition, useCallback, useContext } from 'react';

export default function UserAvatar ({ contentGroup }: { contentGroup: string }) {
  const { exitEditing } = useContext(DashboardContext);
  const router = useRouter();
  const { refetch, data, isLoading } = authApi.useReloadQuery();
  const { currentUser } = useContext(AppContext);

  const handleClickAdmin = useCallback(() => {
    router.push(`/admin/dashboards`);
  }, []);

  return (
    <Menubar.Menu>
      <Menubar.Trigger className="site-header-item">
        <RuiAvatar.Root className="block w-6 h-6 rounded-full overflow-hidden">
          <RuiAvatar.Image src={currentUser.avatar_url} className="w-full h-full" />
          <RuiAvatar.Fallback className="w-full h-full bg-gray-200" />
        </RuiAvatar.Root>
        <ChevronDownIcon className="site-header-item-indicator" width={12} height={12} />
      </Menubar.Trigger>
      <Menubar.Portal>
        <Menubar.Content className="site-header-submenu-content" sideOffset={2} align="end">
          {contentGroup !== 'admin' &&
            <Menubar.Item className="menuitem" onClick={handleClickAdmin}>
              <GearIcon />
              Admin
            </Menubar.Item>
          }
          <Menubar.Item className="menuitem" onClick={() => startTransition(() => {
            logout().then(async () => {
              exitEditing();
              await refetch();
              router.refresh();
            });
          })}>
            <BoxArrowRightIcon />
            Logout
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Portal>
    </Menubar.Menu>
  );
}