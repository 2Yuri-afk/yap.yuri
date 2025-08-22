'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error caught by boundary:', error, errorInfo);
      // TODO: Send to your error monitoring service (e.g., Sentry)
      // logErrorToService(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error} reset={this.reset} />
        );
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="mx-auto max-w-md text-center">
            <AlertTriangle className="text-destructive mx-auto mb-4 h-12 w-12" />
            <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            <div className="space-y-2">
              <Button onClick={this.reset} variant="default">
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="ml-2"
              >
                Go home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-muted-foreground cursor-pointer text-sm">
                  Error details (development only)
                </summary>
                <pre className="bg-muted mt-2 rounded p-4 text-xs whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
