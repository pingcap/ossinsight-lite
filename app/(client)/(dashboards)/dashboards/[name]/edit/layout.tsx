import dynamic from 'next/dynamic';

const SavingIndicator = dynamic(() => import('./SavingIndicator'), { ssr: false });

export default function Layout (props: any) {

  return (
    <>
      {props.children}
      <SavingIndicator />
    </>
  );
}
