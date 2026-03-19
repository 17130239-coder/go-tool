import { useState } from 'react';
import { Space, Radio, Typography, Select } from 'antd';
import { formatSQL, minifySQL, validateSQL } from '../../../utils/sqlFormatter';
import { useInputOutput, useCopyToClipboard } from '../../../hooks';
import {
  FeatureCard,
  PageHeader,
  ErrorAlert,
  PageSectionTitle,
  InputSection,
  OutputSection,
  FormatterActions,
} from '../../../components/shared';
import type { KeywordCase, IndentSize, SqlLanguage } from '../../../types';

const { Text } = Typography;

const LANGUAGES: { value: SqlLanguage; label: string }[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'tsql', label: 'T-SQL (SQL Server)' },
  { value: 'plsql', label: 'PL/SQL (Oracle)' },
];

export function SqlFormatterPage() {
  const { input, setInput, output, setOutput, error, setError, clear } = useInputOutput();
  const { copied, copy } = useCopyToClipboard();

  const [language, setLanguage] = useState<SqlLanguage>('sql');
  const [indent, setIndent] = useState<IndentSize>(2);
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

  const handleCopy = () => {
    if (output) {
      copy(output);
    }
  };

  return (
    <FeatureCard>
      <PageHeader
        title="SQL Formatter"
        description="Format and minify SQL across supported dialects with configurable style options."
      />

      <InputSection
        value={input}
        onChange={handleInputChange}
        label="Input SQL"
        placeholder="SELECT * FROM users WHERE id = 1;"
        hasError={!!error}
      />

      <ErrorAlert error={error} title="SQL Error" />

      <div>
        <PageSectionTitle>Format Options</PageSectionTitle>
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
            <Radio.Group value={keywordCase} onChange={(e) => setKeywordCase(e.target.value)}>
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

      <FormatterActions
        onFormat={handleFormat}
        onMinify={handleMinify}
        onClear={clear}
        formatDisabled={!input.trim() || !!error}
        minifyDisabled={!input.trim()}
      />

      <OutputSection value={output} copied={copied} onCopy={handleCopy} />
    </FeatureCard>
  );
}
