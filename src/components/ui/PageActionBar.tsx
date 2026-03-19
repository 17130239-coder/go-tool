import { Space } from 'antd';
import type { ReactNode } from 'react';

interface PageActionBarProps {
  children?: ReactNode;
}

export function PageActionBar({ children }: PageActionBarProps) {
  if (!children) return null;

  return (
    <div
      className="p-16 mb-24"
      style={{
        background: 'var(--ant-color-bg-container)',
        borderRadius: 'var(--ant-border-radius)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      <Space>{children}</Space>
    </div>
  );
}
