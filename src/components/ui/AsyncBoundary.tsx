import type { ReactNode } from 'react';
import { PageLoader } from './PageLoader';
import { PageError } from './PageError';
import { PageEmpty } from './PageEmpty';

interface AsyncBoundaryProps<T> {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  data: T | undefined | null;
  isEmpty?: (data: T) => boolean;
  children: (data: NonNullable<T>) => ReactNode;
  emptyProps?: {
    description?: string;
    children?: ReactNode;
  };
}

export function AsyncBoundary<T>({
  isLoading,
  isError,
  error,
  onRetry,
  data,
  isEmpty,
  children,
  emptyProps,
}: AsyncBoundaryProps<T>) {
  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return <PageError message={error?.message} onRetry={onRetry} />;
  }

  const dataIsEmpty = isEmpty ? isEmpty(data as T) : Array.isArray(data) && data.length === 0;

  if (!data || dataIsEmpty) {
    return <PageEmpty {...emptyProps} />;
  }

  return <>{children(data as NonNullable<T>)}</>;
}
