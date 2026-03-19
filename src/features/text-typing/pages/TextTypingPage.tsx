import { Typography } from 'antd';
import { TypingTest } from '../components/TypingTest';

export function TextTypingPage() {
  const { Title, Text } = Typography;

  return (
    <div>
      <Title level={4}>Text Typing Speed</Title>
      <Text type="secondary">Monkeytype-like typing core with custom key handling and live metrics.</Text>
      <div className="mt-24">
        <TypingTest />
      </div>
    </div>
  );
}
