import { Component, ComponentType, ErrorInfo, FC, ReactNode, useMemo } from 'react';
import { Alert } from '../../../../components/Alert';
import { getErrorInfo } from '../../utils/error.ts';

export interface ErrorComponentProps {
  error: unknown;
  errorInfo: ErrorInfo;
}

export interface ErrorBoundaryProps {
  errorComponent?: ComponentType<ErrorComponentProps>;
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, { errorProps?: ErrorComponentProps }> {
  constructor (props) {
    super(props);
    this.state = { errorProps: undefined }
  }

  componentDidCatch (error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorProps: {
        error,
        errorInfo,
      },
    });
  }

  render () {
    if (this.state.errorProps) {
      const { errorComponent: EC = DefaultErrorAlert } = this.props;
      return <EC {...this.state.errorProps} />;
    } else {
      return this.props.children;
    }
  }
}

const DefaultErrorAlert: FC<ErrorComponentProps> = ({ error }) => {
  const { title, message } = useMemo(() => {
    return getErrorInfo(error);
  }, [error]);

  return <Alert type="error" title={title} message={message} />;
};
