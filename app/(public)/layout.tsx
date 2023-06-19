import { SiteHeader } from '@/components/SiteHeader';

export default function ({ children }: any) {
  return (
    <>
      <SiteHeader contentGroup="public" />
      {children}
    </>
  );
}