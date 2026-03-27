import type { ReactNode } from 'react';
import { Card, Flex } from 'antd';

interface FeatureCardProps {
  children: ReactNode;
  size?: 'small' | 'middle' | 'large';
  className?: string;
}

/** Top-level wrapper card for feature pages. Provides vertical spacing between sections. */
export function FeatureCard({ children, size = 'large', className }: FeatureCardProps) {
  return (
    <Card className={className}>
      <Flex vertical gap={size} style={{ width: '100%' }}>
        {children}
      </Flex>
    </Card>
  );
}
