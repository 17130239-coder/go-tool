import { useState } from 'react';
import { Card, Flex, Input } from 'antd';
import { useCopyWithFeedback } from '../../hooks';
import {
  FeatureCard,
  PageHeader,
  ErrorAlert,
  ResultField,
  PageSectionTitle,
} from '../../components/shared';
import { convertColor, isValidColor } from './RandomColorUtil';
import type { ColorFormats } from './RandomColorUtil';

/** Default color shown on first render. */
const DEFAULT_COLOR = '#3B82F6';

export function RandomColorPage() {
  const [input, setInput] = useState<string>(DEFAULT_COLOR);
  const [converted, setConverted] = useState<ColorFormats | null>(() => convertColor(DEFAULT_COLOR));
  const [error, setError] = useState<string | null>(null);
  const { copiedKey, handleCopy } = useCopyWithFeedback<keyof ColorFormats>();

  const handleInputChange = (value: string) => {
    setInput(value);

    if (!value.trim()) {
      setConverted(null);
      setError(null);
      return;
    }

    if (isValidColor(value)) {
      const result = convertColor(value);
      setConverted(result);
      setError(null);
    } else {
      setConverted(null);
      setError('Invalid color format. Try: #FF5733, rgb(255, 87, 51), hsl(9, 100%, 60%)');
    }
  };

  const currentColor = converted?.hex || '#CCCCCC';

  return (
    <FeatureCard>
      <PageHeader
        title="Color Converter"
        description="Enter a color in any supported format and convert it into HEX, RGB(A), and HSL(A)."
      />

      <Card size="small">
        <Flex vertical gap={8}>
        <PageSectionTitle>Input Color</PageSectionTitle>
        <Input
          size="large"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="e.g., #3B82F6, rgb(59, 130, 246), hsl(217, 91%, 60%)"
          status={error ? 'error' : undefined}
        />
        </Flex>
      </Card>

      <ErrorAlert error={error} title="Invalid Color" />

      {converted && (
        <Flex vertical gap={16}>
          <Card
            size="small"
            style={{
              width: '100%',
              height: 160,
              borderRadius: 'var(--ant-border-radius)',
              background: currentColor,
            }}
          />

          <Card size="small">
            <Flex vertical gap={8}>
            <PageSectionTitle>Converted Formats</PageSectionTitle>

            {(Object.entries(converted) as [keyof ColorFormats, string][]).map(([format, value]) => (
              <ResultField
                key={format}
                label={format}
                value={value}
                copied={copiedKey === format}
                onCopy={() => {
                  void handleCopy(format, value);
                }}
              />
            ))}
            </Flex>
          </Card>
        </Flex>
      )}
    </FeatureCard>
  );
}
