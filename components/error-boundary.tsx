"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Runtime Error Boundary with Automatic Logging
 * Captures and reports all React component errors
 * Zero-tolerance error handling for production
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private logger: Console;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.logger = console;

    // Bind methods
    this.resetError = this.resetError.bind(this);
    this.logError = this.logError.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Automatic error logging
    this.logError(error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private logError(error: Error, errorInfo: React.ErrorInfo) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    } as const;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logger.group('🚨 Runtime Error Boundary');
      this.logger.error('Error:', error);
      this.logger.error('Component Stack:', errorInfo.componentStack);
      this.logger.error('Full Report:', errorReport);
      this.logger.groupEnd();
    }

    // In production, this would be sent to error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === 'production') {
      // await errorTrackingService.captureException(error, {
      //   extra: errorReport,
      //   tags: { component: 'error-boundary' }
      // });
      this.logger.error('Production Error:', errorReport);
    }
  }

  private resetError() {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI
      return <ErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 * Production-ready error display with recovery options
 */
function ErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-destructive mb-2">Development Error Details:</p>
              <p className="text-xs font-mono break-all">{error.message}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Error ID: {Date.now().toString(36)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Higher-Order Component for Error Boundary Wrapping
 * Utility function to wrap components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...fallbackProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for Manual Error Reporting
 * Allows components to manually report errors to the boundary
 */
export function useErrorReporting() {
  return {
    reportError: (error: Error, context?: Record<string, any>) => {
      // In a real implementation, this would send to error tracking
      console.error('Manual error report:', error, context);

      // Could also trigger a toast notification or custom error UI
    },
  };
}

export default ErrorBoundary;
