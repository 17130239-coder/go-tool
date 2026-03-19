import { useState } from 'react';
import { Input } from 'antd';
import { useCopyToClipboard } from '../../../hooks';
import { FeatureCard, PageHeader } from '../../../components/shared';
import { convertAll } from '../../../utils/stringConverter';
import { ResultRow } from '../components/ResultRow';
import type { ConventionType } from '../types';
import styles from '../NamingConverter.module.css';

const CONVENTION_KEYS: ConventionType[] = [
  'camelCase',
  'kebabCase',
  'snakeCase',
  'pascalCase',
  'constantCase',
];

export function ConverterPage() {
  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<ConventionType | null>(null);
  const { copy } = useCopyToClipboard();

  const results = convertAll(input);

  const handleCopy = async (key: ConventionType) => {
    const value = results[key];
    if (!value) {
      return;
    }

    const result = await copy(value);
    if (result.success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

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
        className="mb-24"
      />

      <div className={styles.resultContainer}>
        {CONVENTION_KEYS.map((key) => (
          <ResultRow
            key={key}
            label={key}
            value={results[key]}
            copied={copiedKey === key}
            onCopy={() => {
              void handleCopy(key);
            }}
          />
        ))}
      </div>
    </FeatureCard>
  );
}
