import { redirect } from 'next/navigation';

export default function Page ({ searchParams }: any) {
  redirect(`/login?redirect_uri=${searchParams.redirect_uri ?? '/'}`);
}
