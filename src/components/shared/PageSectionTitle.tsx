import { Typography } from 'antd';

const { Text } = Typography;

interface PageSectionTitleProps {
  children: string;
}

export function PageSectionTitle({ children }: PageSectionTitleProps) {
  return (
    <Text strong className="mb-8" style={{ display: 'block' }}>
      {children}
    </Text>
  );
}
