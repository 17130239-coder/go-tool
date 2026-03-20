import { Flex, Typography } from 'antd';

const { Text } = Typography;

interface PageSectionTitleProps {
  children: string;
}

export function PageSectionTitle({ children }: PageSectionTitleProps) {
  return (
    <Flex>
      <Text strong style={{ display: 'block' }}>
        {children}
      </Text>
    </Flex>
  );
}
