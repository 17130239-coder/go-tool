import { useState } from 'react';
import { Card, Input, Button, Space, Radio, Alert, Typography, Select } from 'antd';
import {
  CopyOutlined,
  ClearOutlined,
  CompressOutlined,
  FormatPainterOutlined,
} from '@ant-design/icons';
import { formatSQL, minifySQL, validateSQL } from '../../../utils/sqlFormatter';
import type { FormatterOptions, KeywordCase } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

const LANGUAGES = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'tsql', label: 'T-SQL (SQL Server)' },
  { value: 'plsql', label: 'PL/SQL (Oracle)' },
] as const;

export function SqlFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [language, setLanguage] = useState<FormatterOptions['language']>('sql');
  const [indent, setIndent] = useState<number>(2);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [linesBetweenQueries, setLinesBetweenQueries] = useState<number>(2);

  const handleFormat = () => {
    const result = formatSQL(input, {
      language,
      indent,
      keywordCase,
      linesBetweenQueries,
    });

    if (result.success && result.formatted) {
      setOutput(result.formatted);
      setError(null);
    } else {
      setError(result.error || 'Unknown error');
      setOutput('');
    }
  };

  const handleMinify = () => {
    const result = minifySQL(input);

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
        // Silent fail
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
      const validation = validateSQL(value);
      if (!validation.success) {
        setError(validation.error || 'Invalid SQL');
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
              Input SQL
            </Text>
            <TextArea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="SELECT * FROM users WHERE id = 1;"
              autoSize={{ minRows: 8, maxRows: 20 }}
              status={error ? 'error' : undefined}
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert message="SQL Error" description={error} type="error" showIcon />
          )}

          {/* Format Options */}
          <div>
            <Text strong className="mb-8" style={{ display: 'block' }}>
              Format Options
            </Text>
            <Space wrap size="middle">
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  SQL Dialect
                </Text>
                <Select
                  value={language}
                  onChange={setLanguage}
                  options={LANGUAGES}
                  style={{ width: 160 }}
                />
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Indentation
                </Text>
                <Radio.Group value={indent} onChange={(e) => setIndent(e.target.value)}>
                  <Radio.Button value={2}>2 Spaces</Radio.Button>
                  <Radio.Button value={4}>4 Spaces</Radio.Button>
                </Radio.Group>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Keyword Case
                </Text>
                <Radio.Group
                  value={keywordCase}
                  onChange={(e) => setKeywordCase(e.target.value)}
                >
                  <Radio.Button value="upper">UPPER</Radio.Button>
                  <Radio.Button value="lower">lower</Radio.Button>
                  <Radio.Button value="preserve">Preserve</Radio.Button>
                </Radio.Group>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Lines Between Queries
                </Text>
                <Radio.Group
                  value={linesBetweenQueries}
                  onChange={(e) => setLinesBetweenQueries(e.target.value)}
                >
                  <Radio.Button value={1}>1</Radio.Button>
                  <Radio.Button value={2}>2</Radio.Button>
                  <Radio.Button value={3}>3</Radio.Button>
                </Radio.Group>
              </div>
            </Space>
          </div>

          {/* Action Buttons */}
          <Space wrap>
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
              disabled={!input.trim()}
            >
              Minify
            </Button>

            <Button icon={<ClearOutlined />} onClick={handleClear}>
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
