import { migrate } from '@/app/wizard/migrate';
import Link from 'next/link';

export default async function () {
  await migrate();

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2">
      <h2 className="text-lg">Congrats! Your dashboard is ready!</h2>
      <Link className="cursor-pointer underline" href="/">Go to homepage</Link>
      <div className="text-sm text-gray-400 mt-4">
        TODO: Add migration scripts to CI instead of this page.
      </div>
    </div>
  );
}
