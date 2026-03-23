import { Card, Flex, Spin } from 'antd';

export function PageLoader() {
  return (
    <Card>
      <Flex justify="center" align="center" style={{ minHeight: 200, width: '100%' }}>
        <Spin size="large" />
      </Flex>
    </Card>
  );
}
