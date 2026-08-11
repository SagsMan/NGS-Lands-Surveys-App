import { reloadAppAsync } from 'expo';
import { Component, type ErrorInfo, type PropsWithChildren } from 'react';

import { ErrorFallback } from './ErrorFallback';

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) {
      console.error('Unhandled application error', error, errorInfo);
    }
  }

  private handleReload = async () => {
    await reloadAppAsync();
  };

  public render() {
    if (this.state.error) {
      return <ErrorFallback onRetry={this.handleReload} />;
    }

    return this.props.children;
  }
}

export { ErrorFallback } from './ErrorFallback';
