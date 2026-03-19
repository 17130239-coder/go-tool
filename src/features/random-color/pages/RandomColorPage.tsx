import { useState } from 'react';
import { Button, Card, Input, Space, Typography } from 'antd';

const { Title, Text } = Typography;

function randomHexColor() {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, '0').toUpperCase()}`;
}

export function RandomColorPage() {
  const [color, setColor] = useState<string>(randomHexColor());

  const onGenerate = () => {
    setColor(randomHexColor());
  };

  return (
    <Card>
      <Title level={4}>Random Color Generator</Title>
      <Text type="secondary">Click the button to generate a random hex color.</Text>

      <div
        className="mt-16 mb-24"
        style={{
          width: '100%',
          height: 160,
          borderRadius: 'var(--ant-border-radius)',
          border: '1px solid var(--ant-color-border-secondary)',
          background: color,
        }}
      />

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text>Color value</Text>
          <Input className="mt-8" value={color} readOnly />
        </div>
        <Button type="primary" onClick={onGenerate}>
          Random Color
        </Button>
      </Space>
    </Card>
  );
}
