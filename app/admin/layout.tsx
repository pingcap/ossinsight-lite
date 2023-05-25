import Nav from '@/app/admin/nav';
import './layout.scss';

export default async function ({ children }: any) {
  return (
    <div className="ossl-admin min-h-screen flex gap-2">
      <aside className="100vh w-[240px] overflow-y-auto bg-gray-100 sticky top-[0] pt-[40px] left-0">
        <Nav />
      </aside>
      <main className="flex-1 p-2 pt-[40px]">
        {children}
      </main>
    </div>
  );
}
