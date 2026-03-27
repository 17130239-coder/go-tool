import { Flex, Typography } from 'antd';

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  description?: string;
}

/** Page-level header with a title and optional description. Used at the top of every feature page. */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Flex vertical gap={8}>
      <Title level={4} className="m-0">
        {title}
      </Title>
      {description && (
        <Text type="secondary" style={{ display: 'block' }}>
          {description}
        </Text>
      )}
    </Flex>
  );
}
