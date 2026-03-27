import { Flex, Typography } from 'antd';

const { Text } = Typography;

interface PageSectionTitleProps {
  children: string;
}

/** Bold section title used inside cards to label groups of content. */
export function PageSectionTitle({ children }: PageSectionTitleProps) {
  return (
    <Flex>
      <Text strong style={{ display: 'block' }}>
        {children}
      </Text>
    </Flex>
  );
}
