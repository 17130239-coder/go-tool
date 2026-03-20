import { useState } from 'react';
import { Space, Radio, Typography, Select, Alert, Divider } from 'antd';
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
  CopyButton,
} from '../../../components/shared';
import type { KeywordCase, IndentSize, SqlLanguage } from '../../../types';
import { buildSqlAiPrompt } from '../aiHelper';

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
  const { copied: aiPromptCopied, copy: copyAiPrompt } = useCopyToClipboard();

  const [language, setLanguage] = useState<SqlLanguage>('sql');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [linesBetweenQueries, setLinesBetweenQueries] = useState<number>(2);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

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
    setAiError(null);

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

  const handleGenerateAiPrompt = () => {
    const result = buildSqlAiPrompt(input);
    if (!result.success || !result.prompt) {
      setAiError(result.error || 'Unable to generate AI prompt.');
      setAiPrompt('');
      setAiSuggestions([]);
      return;
    }

    setAiPrompt(result.prompt);
    setAiSuggestions(result.suggestions || []);
    setAiError(null);
  };

  const handleCopy = () => {
    if (output) {
      void copy(output);
    }
  };

  const handleCopyAiPrompt = () => {
    if (aiPrompt) {
      void copyAiPrompt(aiPrompt);
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

      <Divider className="m-0" />

      <div>
        <PageSectionTitle>AI SQL Assistant</PageSectionTitle>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text type="secondary">
            Generate a ready-to-use AI prompt to review and improve your SQL query with context-aware
            suggestions.
          </Text>

          <Space wrap>
            <FormatterActions
              onFormat={handleGenerateAiPrompt}
              onClear={() => {
                setAiPrompt('');
                setAiSuggestions([]);
                setAiError(null);
              }}
              formatLabel="Generate AI Prompt"
              clearLabel="Clear AI Output"
              showMinify={false}
              formatDisabled={!input.trim()}
            />

            {aiPrompt && (
              <CopyButton copied={aiPromptCopied} onCopy={handleCopyAiPrompt} size="middle" />
            )}
          </Space>

          <ErrorAlert error={aiError} title="AI Prompt Error" />

          {aiSuggestions.length > 0 && (
            <Alert
              type="info"
              showIcon
              message="Detected SQL Suggestions"
              description={
                <ul className="m-0 pl-16">
                  {aiSuggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul>
              }
            />
          )}

          <OutputSection
            value={aiPrompt}
            copied={aiPromptCopied}
            onCopy={handleCopyAiPrompt}
            label="AI Prompt Output"
            minRows={10}
            maxRows={24}
            showCopyButton={false}
          />
        </Space>
      </div>
    </FeatureCard>
  );
}
