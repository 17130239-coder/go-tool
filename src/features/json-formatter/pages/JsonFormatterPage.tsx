import { useState } from 'react';
import { Card, Input, Button, Space, Radio, Alert, Typography } from 'antd';
import { CopyOutlined, ClearOutlined, CompressOutlined, FormatPainterOutlined } from '@ant-design/icons';
import { formatJSON, minifyJSON, validateJSON } from '../../../utils/jsonFormatter';
import type { IndentSize } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

export function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState<IndentSize>(2);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const result = formatJSON(input, { indentSize });
    
    if (result.success && result.formatted) {
      setOutput(result.formatted);
      setError(null);
    } else {
      setError(result.error || 'Unknown error');
      setOutput('');
    }
  };

  const handleMinify = () => {
    const result = minifyJSON(input);
    
    if (result.success && result.formatted) {
      setOutput(result.formatted);
      setError(null);
    } else {
      setError(result.error || 'Unknown error');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silent fail - clipboard API might not be available
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Real-time validation
    if (value.trim()) {
      const validation = validateJSON(value);
      if (!validation.success) {
        setError(validation.error || 'Invalid JSON');
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  return (
    <div>
      <Card className="mb-24">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Input Section */}
          <div>
            <Text strong className="mb-24" style={{ display: 'block' }}>
              Input JSON
            </Text>
            <TextArea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder='{"name": "example", "value": 123}'
              autoSize={{ minRows: 8, maxRows: 20 }}
              status={error ? 'error' : undefined}
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert
              message="JSON Error"
              description={error}
              type="error"
              showIcon
            />
          )}

          {/* Controls */}
          <Space wrap>
            <Radio.Group value={indentSize} onChange={(e) => setIndentSize(e.target.value)}>
              <Radio.Button value={2}>2 Spaces</Radio.Button>
              <Radio.Button value={4}>4 Spaces</Radio.Button>
            </Radio.Group>
            
            <Button
              type="primary"
              icon={<FormatPainterOutlined />}
              onClick={handleFormat}
              disabled={!input.trim() || !!error}
            >
              Format
            </Button>
            
            <Button
              icon={<CompressOutlined />}
              onClick={handleMinify}
              disabled={!input.trim() || !!error}
            >
              Minify
            </Button>
            
            <Button
              icon={<ClearOutlined />}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Space>

          {/* Output Section */}
          {output && (
            <div>
              <Space style={{ marginBottom: 8 }}>
                <Text strong>Output</Text>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  type={copied ? 'primary' : 'default'}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Space>
              <TextArea
                value={output}
                readOnly
                autoSize={{ minRows: 8, maxRows: 20 }}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}
