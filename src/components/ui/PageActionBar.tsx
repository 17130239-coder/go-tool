import { Card, Flex, Space } from 'antd';
import type { ReactNode } from 'react';

interface PageActionBarProps {
  children?: ReactNode;
}

export function PageActionBar({ children }: PageActionBarProps) {
  if (!children) return null;

  return (
    <Card size="small" className="mb-24">
      <Flex justify="flex-end" align="center">
        <Space>{children}</Space>
      </Flex>
    </Card>
  );
}
