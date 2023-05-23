import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { DynamicOptions } from 'next/dist/shared/lib/dynamic';

export default function clientOnly<P> (Component: ComponentType<P>, loading: DynamicOptions['loading'] = () => null): ComponentType<P> {
  return dynamic(() => Promise.resolve(Component), { ssr: false, loading }) as any;
}
