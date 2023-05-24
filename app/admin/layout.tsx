import './layout.scss';
import Nav from '@/app/admin/nav';
import Main from '@/app/admin/main';

export default function ({ children }: any) {
  return (
    <div className="ossl-admin min-h-screen flex gap-2">
      <aside className="h-[calc(100vh-40px)] w-[240px] overflow-y-auto bg-gray-100 sticky top-[40px] left-0">
        <Nav />
      </aside>
      <main className="flex-1 p-2 pt-[40px]">
        <Main>{children}</Main>
      </main>
    </div>
  );
}