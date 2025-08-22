'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to your error monitoring service (e.g., Sentry)
      // logErrorToService(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle className="text-destructive mx-auto mb-6 h-16 w-16" />
        <h1 className="mb-3 text-3xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="space-x-4">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            size="lg"
          >
            Go to homepage
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 text-left">
            <details>
              <summary className="text-muted-foreground cursor-pointer text-sm">
                Error details (development only)
              </summary>
              <div className="bg-muted mt-4 rounded-lg p-4">
                <p className="text-destructive font-mono text-sm">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
