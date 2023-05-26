import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import { WidgetModule } from '@/core/widgets-manifest';
import { DynamicOptionsLoadingProps } from 'next/dist/shared/lib/dynamic';
import dynamic, { Loader } from 'next/dynamic';
import { FC, forwardRef } from 'react';

export function resolveWidgetComponents (module: WidgetModule) {
  const Widget = dynamicForwardRef(module.Widget, WidgetLoading);
  const ConfigureComponent = module.ConfigureComponent && dynamicForwardRef(module.ConfigureComponent, ConfigureComponentLoading);
  const NewButton = module.NewButton && dynamicForwardRef(module.NewButton, NewButtonLoading);

  return { Widget, ConfigureComponent, NewButton };
}

function dynamicForwardRef<P> (loader: Loader<P>, LoadingComponent: FC<DynamicOptionsLoadingProps>) {
  const DynamicComponent = dynamic(loader, {
    loading: props => <LoadingComponent {...props} />,
  });

  return forwardRef<HTMLDivElement, P>(function (props: P, forwardedRef) {
    // See https://github.com/vercel/next.js/issues/40769
    return <DynamicComponent {...props} forwardedRef={forwardedRef} />;
  });
}

function WidgetLoading (props: DynamicOptionsLoadingProps) {
  return (
    <div className="w-full h-full flex gap-2 items-center justify-center text-gray-400">
      <LoadingIndicator />
      <span>Loading ...</span>
    </div>
  );
}

function ConfigureComponentLoading (props: DynamicOptionsLoadingProps) {
  return (
    <div className="h-full flex gap-2 items-center justify-center text-gray-400">
      <LoadingIndicator />
      <span>Loading ...</span>
    </div>
  );
}

function NewButtonLoading (props: DynamicOptionsLoadingProps) {
  return (
    <span className="inline-flex gap-2 items-center justify-center text-gray-400 text-sm">
      <LoadingIndicator />
    </span>
  );
}
