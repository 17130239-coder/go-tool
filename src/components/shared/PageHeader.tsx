import { Typography } from 'antd';

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <Title level={4} className="m-0">
        {title}
      </Title>
      {description && (
        <Text type="secondary" className="mt-8" style={{ display: 'block' }}>
          {description}
        </Text>
      )}
    </div>
  );
}
