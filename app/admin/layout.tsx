import './layout.scss';
import Nav from '@/app/admin/nav';
import Main from '@/app/admin/main';
import { authenticateGuard } from '@/src/auth';

export default async function ({ children }: any) {
  let authenticated = false;
  try {
    await authenticateGuard('')
    authenticated = true;
  } catch {
  }

  return (
    <div className="ossl-admin min-h-screen flex gap-2">
      <aside className="100vh w-[240px] overflow-y-auto bg-gray-100 sticky top-[0] pt-[40px] left-0">
        <Nav authenticated={authenticated} />
      </aside>
      <main className="flex-1 p-2 pt-[40px]">
        <Main>{children}</Main>
      </main>
    </div>
  );
}
