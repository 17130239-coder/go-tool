import { useMemo, useState } from 'react';
import { Button, Card, InputNumber, Space, Typography } from 'antd';

const { Title, Text } = Typography;

function generateRandomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function RandomNumberPage() {
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(100);
  const [result, setResult] = useState<number | null>(null);

  const isRangeValid = useMemo(() => max >= min, [max, min]);

  const onGenerate = () => {
    if (!isRangeValid) return;
    setResult(generateRandomInRange(min, max));
  };

  return (
    <Card>
      <Title level={4}>Random Number Generator</Title>
      <Text type="secondary">Set a range and click the button to get a random number.</Text>

      <div className="mt-16 mb-24">
        <Space size="middle" wrap>
          <div>
            <Text>Min (0 or greater)</Text>
            <div className="mt-8">
              <InputNumber
                min={0}
                value={min}
                onChange={(value) => setMin(Math.max(0, value ?? 0))}
                precision={0}
              />
            </div>
          </div>

          <div>
            <Text>Max</Text>
            <div className="mt-8">
              <InputNumber
                min={0}
                value={max}
                onChange={(value) => setMax(Math.max(0, value ?? 0))}
                precision={0}
              />
            </div>
          </div>
        </Space>
      </div>

      {!isRangeValid && (
        <Text type="danger" className="mb-16">
          Max must be greater than or equal to Min.
        </Text>
      )}

      <div className="mb-24">
        <Button type="primary" onClick={onGenerate} disabled={!isRangeValid}>
          Random Number
        </Button>
      </div>

      <Title level={5} className="m-0">
        Result: {result ?? '-'}
      </Title>
    </Card>
  );
}
