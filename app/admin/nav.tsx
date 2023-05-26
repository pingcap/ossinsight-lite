'use client';
import { startAppStateLoadingTransition } from '@/app/bind';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';

const navs = [
  {
    key: 'repositories',
    title: 'Tracking Repos',
    href: '/admin/repositories',
    public: false,
  },
  {
    key: 'dashboards',
    title: 'Dashboards',
    href: '/admin/dashboards',
    public: false,
  },
  {
    key: 'widgets',
    title: 'Widgets',
    href: '/admin/widgets',
    public: false,
  },
  {
    key: 'import',
    title: 'Import layout',
    href: '/admin/import',
    public: false,
  },
  {
    key: 'account',
    title: 'Account',
    href: '/admin/account',
    public: false,
  },
  {
    key: 'status',
    title: 'Status',
    href: '/status',
    public: true,
  },
] as const;

export default function Nav () {
  const [first] = useSelectedLayoutSegments();
  const router = useRouter();

  return (
    <NavigationMenu.Root orientation="vertical" className="nav-menu">
      <NavigationMenu.List>
        {navs.map(nav => (
          <NavigationMenu.Item key={nav.key}>
            <NavigationMenu.Link className='cursor-pointer' onSelect={() => startAppStateLoadingTransition(() => router.push(nav.href))} active={first === nav.key}>
              {nav.title}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}