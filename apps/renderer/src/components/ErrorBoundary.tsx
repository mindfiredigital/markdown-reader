import React from 'react';
import { logger } from '../utils/helpers/logger';
import { ErrorBoundaryState } from '../types/component-types';


export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Renderer error boundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg p-6 text-text-base">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-center text-sm text-text-muted">
            The renderer hit an unexpected error. You can try rendering the app again.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="max-w-xl overflow-auto rounded border border-border-theme bg-surface p-3 text-xs">
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            className="rounded border border-border-theme bg-surface px-3 py-2 text-sm hover:bg-accent-bg"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
