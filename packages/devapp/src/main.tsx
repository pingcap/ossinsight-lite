import { createRoot } from 'react-dom/client';
import App from './App';
import './main.css';
import { Component, ErrorInfo, PropsWithChildren, StrictMode } from 'react';


class ErrorBoundary extends Component<PropsWithChildren<{}>, { hasError: boolean, error: unknown }> {
  constructor (props: {}) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError (error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  override componentDidCatch (error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

console.trace('[layout:root] go, main');

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// TODO: fix bindings and enable strict mode.
