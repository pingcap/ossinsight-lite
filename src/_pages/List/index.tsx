import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { globSync } from 'glob';
import path from 'path';
import AutoSaveLibrary from '@/src/components/WidgetsManager/AutoSaveLibrary';

const Section = dynamic(() => import('@/src/_pages/List/Section'), { ssr: false });

const names = globSync('./packages/widgets/src/widgets/**/index.ts')
  .map(fn => path.relative('./packages/widgets/src/widgets/', fn).replace(/\/index\.ts$/, ''))
  .sort();

console.error(process.cwd(), names);

export default function List () {
  return (
    <div className="container m-auto py-4">
      <h1 className="text-xl">Widgets list</h1>
      {names.map(name => (
        <section key={name} className="mt-8">
          <h2 className="text-lg">{name}</h2>
          <Suspense>
            <Section name={name} />
          </Suspense>
        </section>
      ))}

      <Suspense>
        <AutoSaveLibrary />
      </Suspense>
    </div>
  );
}
