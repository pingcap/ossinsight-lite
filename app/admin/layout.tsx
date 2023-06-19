import Nav from '@/components/pages/admin/nav';
import { SiteHeader } from '@/components/SiteHeader';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg';
import Link from 'next/link';
import './layout.scss';

export default async function ({ children }: any) {
  return (
    <div className="ossl-admin min-h-screen flex gap-2">
      <aside className="h-screen w-[240px] overflow-y-auto sticky top-[0] pt-[64px] left-0 px-4">
        <Nav />
      </aside>
      <main className="flex-1 p-2 pt-[64px]">
        <Link className="btn btn-link btn-no-px" href="/" prefetch={false}>
          <ChevronLeftIcon />
          Back to home
        </Link>
        {children}
        <SiteHeader dashboardNames={[]} contentGroup="admin" />
      </main>
    </div>
  );
}
