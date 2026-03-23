import { useMemo, useState } from 'react';
import { Button, Card, Flex, InputNumber, Space, Statistic, Typography } from 'antd';
import { FeatureCard, PageHeader, ErrorAlert } from '../../../components/shared';
import { generateRandomInRange } from '../utils/randomNumber';

const { Text } = Typography;

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

      <Card size="small">
        <Flex gap={16} wrap>
          <Flex vertical gap={8}>
            <Text>Min (0 or greater)</Text>
            <InputNumber
              min={0}
              value={min}
              onChange={(value) => setMin(Math.max(0, value ?? 0))}
              precision={0}
            />
          </Flex>

          <Flex vertical gap={8}>
            <Text>Max</Text>
            <InputNumber
              min={0}
              value={max}
              onChange={(value) => setMax(Math.max(0, value ?? 0))}
              precision={0}
            />
          </Flex>
        </Flex>
      </Card>

      <ErrorAlert error={!isRangeValid ? 'Max must be greater than or equal to Min.' : null} />

      <Space>
        <Button type="primary" onClick={onGenerate} disabled={!isRangeValid}>
          Random Number
        </Button>
      </Space>

      <Card size="small">
        <Statistic title="Result" value={result ?? '-'} />
      </Card>
    </FeatureCard>
  );
}
