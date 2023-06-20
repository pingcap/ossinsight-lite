'use client';

import { startAppStateLoadingTransition } from '@/core/bind-client';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';

type NavItem = {
  key: string
  title: string
  href: string
  public: boolean
  group: string
}

const navs: NavItem[] = [
  {
    key: 'widgets',
    title: 'Widgets',
    href: '/admin/widgets',
    public: false,
    group: 'Management',
  },
  {
    key: 'dashboards',
    title: 'Dashboards',
    href: '/admin/dashboards',
    public: false,
    group: 'Management',
  },
  {
    key: 'repositories',
    title: 'Watching Repos',
    href: '/admin/repositories',
    public: false,
    group: 'Management',
  },
  {
    key: 'import',
    title: 'Import template',
    href: '/admin/import',
    public: false,
    group: 'Management',
  },
  {
    key: 'security',
    title: 'Security',
    href: '/admin/security',
    public: false,
    group: 'Settings',
  },
  {
    key: 'account',
    title: 'Account',
    href: '/admin/account',
    public: false,
    group: 'Settings',
  },
  {
    key: 'status',
    title: 'Status',
    href: '/status',
    public: true,
    group: 'Settings',
  },
];

const groups = navs.reduce((groups, item) => {
  const gi = groups.findIndex(group => group.group === item.group);
  if (gi !== -1) {
    groups[gi].items.push(item);
  } else {
    groups.push({
      group: item.group,
      items: [item],
    });
  }
  return groups;
}, [] as {
  group: string
  items: NavItem[]
}[]);

export default function Nav () {
  const [first] = useSelectedLayoutSegments();
  const router = useRouter();

  const current = decodeURIComponent(first);

  return (
    <menu className="nav-menu">
      {groups.map(({ group, items }) => [
          <h6 key={`group-${group}`} className="nav-menu-group-title">{group}</h6>,
          <ul key={`group-items-${group}`}>
            {items.map(nav => (
              <li className="nav-menu-item" key={nav.key} data-active={current === nav.key}>
                <span className="indicator" />
                <button className="cursor-pointer" onClick={() => startAppStateLoadingTransition(() => router.push(nav.href))}>
                  {nav.title}
                </button>
              </li>
            ))}
          </ul>,
        ],
      )}
    </menu>
  );
}