import { redirect } from 'next/navigation';

export default function () {
  redirect('/');
}

export const dynamic = 'force-dynamic';
