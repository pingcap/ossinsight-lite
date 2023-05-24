'use client';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';

const navs = [
  {
    key: 'repositories',
    title: 'Tracking Repos',
    href: '/admin/repositories',
  },
  {
    key: 'dashboards',
    title: 'Dashboards Management',
    href: '/admin/dashboards',
  },
  {
    key: 'widgets',
    title: 'Widgets Management',
    href: '/admin/widgets',
  },
  {
    key: 'import',
    title: 'Import layout',
    href: '/admin/import',
  },
  {
    key: 'account',
    title: 'Account',
    href: '/admin/account',
  },
  {
    key: 'status',
    title: 'Status',
    href: '/admin/status',
  },
] as const;

export default function Nav () {
  const [first] = useSelectedLayoutSegments();

  return (
    <NavigationMenu.Root orientation="vertical" className="nav-menu">
      <NavigationMenu.List>
        {navs.map(nav => (
          <NavigationMenu.Item key={nav.key}>
            <NavigationMenu.Link asChild active={first === nav.key}>
              <Link href={nav.href}>
                {nav.title}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}