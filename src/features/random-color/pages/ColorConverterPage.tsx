import { useState } from 'react';
import { Card, Input, Space, Typography, Alert, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { convertColor, isValidColor } from '../../../utils/colorConverter';
import type { ColorFormats } from '../../../utils/colorConverter';

const { Title, Text } = Typography;

export function ColorConverterPage() {
  const [input, setInput] = useState<string>('#3B82F6');
  const [converted, setConverted] = useState<ColorFormats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

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

  const handleCopy = async (format: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch {
      // Silent fail
    }
  };

  const currentColor = converted?.hex || '#CCCCCC';

  return (
    <Card>
      <Title level={4}>Color Converter</Title>
      <Text type="secondary">
        Enter a color in any format (HEX, RGB, RGBA, HSL, HSLA) to convert it to all other formats.
      </Text>

      <div className="mt-16 mb-24">
        <Text strong className="mb-8" style={{ display: 'block' }}>
          Input Color
        </Text>
        <Input
          size="large"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="e.g., #3B82F6, rgb(59, 130, 246), hsl(217, 91%, 60%)"
          status={error ? 'error' : undefined}
        />
      </div>

      {error && (
        <Alert
          message="Invalid Color"
          description={error}
          type="error"
          showIcon
          className="mb-24"
        />
      )}

      {converted && (
        <>
          {/* Color Preview */}
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

          {/* Converted Formats */}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text strong>Converted Formats</Text>

            {Object.entries(converted).map(([format, value]) => (
              <div key={format}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ textTransform: 'uppercase', minWidth: 60 }}>
                    {format}
                  </Text>
                  <Space>
                    <Input
                      value={value}
                      readOnly
                      style={{ fontFamily: 'monospace', minWidth: 280 }}
                    />
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(format, value)}
                      type={copiedFormat === format ? 'primary' : 'default'}
                    >
                      {copiedFormat === format ? 'Copied!' : 'Copy'}
                    </Button>
                  </Space>
                </Space>
              </div>
            ))}
          </Space>
        </>
      )}
    </Card>
  );
}
