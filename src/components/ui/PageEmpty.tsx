import { Card, Empty, Flex } from 'antd';

interface PageEmptyProps {
  description?: string;
  children?: React.ReactNode;
}

export function PageEmpty({ description, children }: PageEmptyProps) {
  return (
    <Card>
      <Flex justify="center" className="py-32">
        <Empty description={description || 'No data to display'}>{children}</Empty>
      </Flex>
    </Card>
  );
}
