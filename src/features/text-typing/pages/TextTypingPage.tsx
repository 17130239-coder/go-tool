import { Space } from 'antd';
import { PageHeader } from '../../../components/shared';
import { TypingTest } from '../components/TypingTest';

export function TextTypingPage() {
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <PageHeader
        title="Text Typing Speed"
        description="Monkeytype-like typing core with custom key handling and live metrics."
      />
      <TypingTest />
    </Space>
  );
}
