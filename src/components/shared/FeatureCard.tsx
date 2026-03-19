import type { ReactNode } from 'react';
import { Card, Space } from 'antd';

interface FeatureCardProps {
  children: ReactNode;
  size?: 'small' | 'middle' | 'large';
  className?: string;
}

export function FeatureCard({ children, size = 'large', className }: FeatureCardProps) {
  return (
    <Card className={className}>
      <Space orientation="vertical" size={size} style={{ width: '100%' }}>
        {children}
      </Space>
    </Card>
  );
}
