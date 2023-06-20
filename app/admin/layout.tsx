import Nav from '@/components/pages/admin/nav';
import { SiteHeader } from '@/components/SiteHeader';
import './layout.scss';

export default async function ({ children }: any) {
  return (
    <div className="ossl-admin min-h-screen flex gap-2">
      <aside className="h-screen w-[240px] overflow-y-auto sticky top-[0] pt-[64px] left-0 px-4">
        <Nav />
      </aside>
      <main className="flex-1 p-2 pt-[64px]">
        {children}
        <SiteHeader dashboardNames={[]} contentGroup="admin" />
      </main>
    </div>
  );
}
