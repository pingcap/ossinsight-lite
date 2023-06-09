import { Alert } from '@/components/Alert';
import { WidgetModule } from '@/core/widgets-manifest';
import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import clsx from 'clsx';
import { DynamicOptionsLoadingProps } from 'next/dist/shared/lib/dynamic';
import dynamic, { Loader } from 'next/dynamic';
import { ComponentType, FC, forwardRef, HTMLAttributes } from 'react';

export function resolveWidgetComponents (module: WidgetModule) {
  const Widget = dynamicForwardRef(module.Widget, WidgetLoading);
  const WidgetDetails = module.WidgetDetails && dynamicForwardRef(module.WidgetDetails, WidgetLoading);
  const ConfigureComponent = module.ConfigureComponent && dynamicForwardRef(module.ConfigureComponent, ConfigureComponentLoading);
  const Icon = module.Icon && dynamic(module.Icon, { loading: NewButtonLoading });

  return { Widget, WidgetDetails, ConfigureComponent, Icon };
}

function dynamicForwardRef<P> (loader: Loader<P>, LoadingComponent: FC<DynamicOptionsLoadingProps>) {
  const DynamicComponent = dynamic(async () => {
    try {
      if (loader instanceof Promise) {
        return await loader;
      } else {
        return await loader();
      }
    } catch (e) {
      return createErrorWidget<P>(e);
    }
  }, {
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

function createErrorWidget<P> (e: any): ComponentType<P> {
  return forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
    return (
      <div className={clsx(props.className, 'flex items-center justify-center p-2')}>
        <Alert type="error" title={`Failed to load widget`} message={String(e?.maessage ?? e)} />
      </div>
    );
  }) as any;
}
