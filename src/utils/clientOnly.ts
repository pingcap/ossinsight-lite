import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

export default function clientOnly<P> (Component: ComponentType<P>): ComponentType<P> {
  return dynamic(() => Promise.resolve(Component), { ssr: false });
}