import { useState, useEffect } from 'react';
import { Input, Space } from 'antd';
import { convertColor, isValidColor } from '../../../utils/colorConverter';
import { useCopyToClipboard } from '../../../hooks';
import {
  FeatureCard,
  PageHeader,
  ErrorAlert,
  ResultField,
  PageSectionTitle,
} from '../../../components/shared';
import type { ColorFormats } from '../../../utils/colorConverter';

export function ColorConverterPage() {
  const [input, setInput] = useState<string>('#3B82F6');
  const [converted, setConverted] = useState<ColorFormats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<keyof ColorFormats | null>(null);
  const { copy } = useCopyToClipboard();

  // Initialize with default color
  useEffect(() => {
    handleInputChange(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleCopy = async (format: keyof ColorFormats, value: string) => {
    const result = await copy(value);
    if (result.success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  const currentColor = converted?.hex || '#CCCCCC';

  return (
    <FeatureCard>
      <PageHeader
        title="Color Converter"
        description="Enter a color in any supported format and convert it into HEX, RGB(A), and HSL(A)."
      />

      <div>
        <PageSectionTitle>Input Color</PageSectionTitle>
        <Input
          size="large"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="e.g., #3B82F6, rgb(59, 130, 246), hsl(217, 91%, 60%)"
          status={error ? 'error' : undefined}
        />
      </div>

      <ErrorAlert error={error} title="Invalid Color" />

      {converted && (
        <>
          <div
            className="mb-24"
            style={{
              width: '100%',
              height: 160,
              borderRadius: 'var(--ant-border-radius)',
              border: '1px solid var(--ant-color-border-secondary)',
              background: currentColor,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          />

          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <PageSectionTitle>Converted Formats</PageSectionTitle>

            {(Object.entries(converted) as [keyof ColorFormats, string][]).map(([format, value]) => (
              <ResultField
                key={format}
                label={format}
                value={value}
                copied={copiedFormat === format}
                onCopy={() => {
                  void handleCopy(format, value);
                }}
              />
            ))}
          </Space>
        </>
      )}
    </FeatureCard>
  );
}
