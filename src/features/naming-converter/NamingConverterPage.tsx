import { useState } from 'react';
import { Flex, Input } from 'antd';
import { useCopyWithFeedback } from '../../hooks';
import { FeatureCard, PageHeader } from '../../components/shared';
import { convertAll } from './NamingConverterUtil';
import { ResultRow } from './components/ResultRow';
import type { ConventionType } from './NamingConverterType';

const CONVENTION_KEYS: ConventionType[] = [
  'camelCase',
  'kebabCase',
  'snakeCase',
  'pascalCase',
  'constantCase',
];

export function NamingConverterPage() {
  const [input, setInput] = useState('');
  const { copiedKey, handleCopy } = useCopyWithFeedback<ConventionType>();

  const results = convertAll(input);

  return (
    <FeatureCard>
      <PageHeader
        title="Naming Converter"
        description="Convert input text into common naming conventions used in codebases."
      />

      <Input.TextArea
        size="large"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a string to convert..."
        autoSize={{ minRows: 2, maxRows: 6 }}
      />

      <Flex vertical gap={8}>
        {CONVENTION_KEYS.map((key) => (
          <ResultRow
            key={key}
            label={key}
            value={results[key]}
            copied={copiedKey === key}
            onCopy={() => {
              void handleCopy(key, results[key]);
            }}
          />
        ))}
      </Flex>
    </FeatureCard>
  );
}
