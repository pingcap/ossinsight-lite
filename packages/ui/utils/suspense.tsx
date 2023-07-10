import { ErrorBoundary, ErrorComponentProps } from '@/packages/ui/components/error-boundary';
import { ComponentType, FC, ForwardedRef, forwardRef, ReactNode, RefAttributes, Suspense } from 'react';

export function withSuspense<T, P> (Component: FC<P> & RefAttributes<T>, fallback?: (ref: ForwardedRef<T>) => ReactNode, errorComponent?: ComponentType<ErrorComponentProps>) {
  return forwardRef<T, P>(function (props, ref) {
    return (
      <Suspense fallback={fallback?.(ref)}>
        <ErrorBoundary errorComponent={errorComponent}>
          <Component {...props} ref={ref} />
        </ErrorBoundary>
      </Suspense>
    );
  });
}

export function wrapSuspense (children: ReactNode, fallback?: ReactNode) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
