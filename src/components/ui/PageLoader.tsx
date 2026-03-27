import { Card, Flex, Spin } from 'antd';

/** Full-page loading spinner. Shown during lazy route transitions. */
export function PageLoader() {
  return (
    <Card>
      <Flex justify="center" align="center" style={{ minHeight: 200, width: '100%' }}>
        <Spin size="large" />
      </Flex>
    </Card>
  );
}
