import { useState } from 'react';
import { Space, Radio } from 'antd';
import { formatJSON, minifyJSON, validateJSON } from '../../../utils/jsonFormatter';
import { useInputOutput, useCopyToClipboard } from '../../../hooks';
import {
  FeatureCard,
  PageHeader,
  ErrorAlert,
  InputSection,
  OutputSection,
  FormatterActions,
} from '../../../components/shared';
import type { IndentSize } from '../../../types';

export function JsonFormatterPage() {
  const { input, setInput, output, setOutput, error, setError, clear } = useInputOutput();
  const { copied, copy } = useCopyToClipboard();
  const [indentSize, setIndentSize] = useState<IndentSize>(2);

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

  const handleCopy = () => {
    if (output) {
      copy(output);
    }
  };

  return (
    <FeatureCard>
      <PageHeader
        title="JSON Formatter"
        description="Validate, format, and minify JSON with configurable indentation."
      />

      <InputSection
        value={input}
        onChange={handleInputChange}
        label="Input JSON"
        placeholder='{"name": "example", "value": 123}'
        hasError={!!error}
      />

      <ErrorAlert error={error} title="JSON Error" />

      <Space wrap>
        <Radio.Group value={indentSize} onChange={(e) => setIndentSize(e.target.value)}>
          <Radio.Button value={2}>2 Spaces</Radio.Button>
          <Radio.Button value={4}>4 Spaces</Radio.Button>
        </Radio.Group>

        <FormatterActions
          onFormat={handleFormat}
          onMinify={handleMinify}
          onClear={clear}
          formatDisabled={!input.trim() || !!error}
          minifyDisabled={!input.trim() || !!error}
        />
      </Space>

      <OutputSection value={output} copied={copied} onCopy={handleCopy} />
    </FeatureCard>
  );
}
