import './layout.scss';
import { Suspense } from 'react';
import Link from 'next/link';

export default function ({ children }: any) {
  return (
    <div className="ossl-admin min-h-screen flex gap-2">
      <aside className="h-screen w-[240px] overflow-y-auto p-2">
        <nav>
          <ul>
            <li>
              <Link href="/admin/repositories">Tracking Repos</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-2">
        <Suspense fallback="Loading data...">
          {children}
        </Suspense>
      </main>
    </div>
  );
}