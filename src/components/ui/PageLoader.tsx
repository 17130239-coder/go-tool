import { Card, Flex, Spin } from 'antd';
import { useState, useEffect } from 'react';

interface PageLoaderProps {
  timeoutMs?: number;
  onTimeout?: () => void;
}

export function PageLoader({ timeoutMs = 15000, onTimeout }: PageLoaderProps) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
      onTimeout?.();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs, onTimeout]);

  if (timedOut && onTimeout) {
    return null; // The parent should handle the error state now
  }

  return (
    <Card>
      <Flex justify="center" align="center" style={{ minHeight: 200, width: '100%' }}>
        <Spin size="large" />
      </Flex>
    </Card>
  );
}
