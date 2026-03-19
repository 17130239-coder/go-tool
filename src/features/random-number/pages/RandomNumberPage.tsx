import { useMemo, useState } from 'react';
import { Button, InputNumber, Space, Typography } from 'antd';
import { FeatureCard, PageHeader, ErrorAlert } from '../../../components/shared';

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
    <FeatureCard>
      <PageHeader
        title="Random Number Generator"
        description="Set an inclusive min/max range and generate a random integer."
      />

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

      <ErrorAlert error={!isRangeValid ? 'Max must be greater than or equal to Min.' : null} />

      <div>
        <Button type="primary" onClick={onGenerate} disabled={!isRangeValid}>
          Random Number
        </Button>
      </div>

      <Title level={5} className="m-0">
        Result: {result ?? '-'}
      </Title>
    </FeatureCard>
  );
}
