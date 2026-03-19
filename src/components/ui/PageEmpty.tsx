import { Empty } from 'antd';

interface PageEmptyProps {
  description?: string;
  children?: React.ReactNode;
}

export function PageEmpty({ description, children }: PageEmptyProps) {
  return (
    <div style={{ padding: '40px 0' }}>
      <Empty description={description || 'No data to display'}>{children}</Empty>
    </div>
  );
}
