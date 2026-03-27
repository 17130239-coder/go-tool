import { Alert } from 'antd';

interface ErrorAlertProps {
  error: string | null;
  title?: string;
  className?: string;
}

/** Conditional error banner. Renders nothing when `error` is null. */
export function ErrorAlert({ error, title = 'Error', className }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert
      message={title}
      description={error}
      type="error"
      showIcon
      className={className}
    />
  );
}
