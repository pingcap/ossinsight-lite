import { ComponentType, ReactNode } from 'react';
import { ErrorBoundary, ErrorComponent } from 'next/dist/client/components/error-boundary';

export function withFormErrorBoundary<P> (Form: ComponentType<P & { errorChildren?: ReactNode, reset?: () => void; }>, FormError: ErrorComponent): ComponentType<P> {
  return (formProps: P) => {
    const FormWithError: ErrorComponent = (errorProps) => {
      return <Form {...formProps} errorChildren={<FormError {...errorProps} />} reset={errorProps.reset} />;
    };

    return (
      <ErrorBoundary errorComponent={FormWithError}>
        <Form {...formProps} errorChildren={undefined} reset={undefined} />
      </ErrorBoundary>
    );
  };
}
