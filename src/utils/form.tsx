import { ComponentType, ReactNode } from 'react';
import { ErrorBoundary, ErrorComponent } from 'next/dist/client/components/error-boundary';
import { isRedirectError } from 'next/dist/client/components/redirect';

export function withFormErrorBoundary<P> (Form: ComponentType<P & { errorChildren?: ReactNode, reset?: () => void; }>, FormError: ErrorComponent): ComponentType<P> {
  return (formProps: P) => {
    const FormWithError: ErrorComponent = (errorProps) => {
      if (isRedirectError(errorProps.error)) {
        throw errorProps.error;
      }
      return <Form {...formProps} errorChildren={<FormError {...errorProps} />} reset={errorProps.reset} />;
    };

    return (
      <ErrorBoundary errorComponent={FormWithError}>
        <Form {...formProps} errorChildren={undefined} reset={undefined} />
      </ErrorBoundary>
    );
  };
}
