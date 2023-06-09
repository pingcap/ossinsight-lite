import DefaultMenu from '@/components/menu/DefaultMenu';

export default function ({ children }: any) {
  return (
    <div className="bg-white">
      {children}
      <DefaultMenu />
    </div>
  );
}