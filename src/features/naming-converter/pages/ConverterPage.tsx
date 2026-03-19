import { useState } from 'react';
import { Input, Card } from 'antd';
import { convertAll } from '../../../utils/stringConverter';
import { ResultRow } from '../components/ResultRow';
import type { ConventionType } from '../types';
import styles from '../NamingConverter.module.css';

export function ConverterPage() {
  const [input, setInput] = useState('');

  const results = convertAll(input);

  const conventionKeys: ConventionType[] = [
    'camelCase',
    'kebabCase',
    'snakeCase',
    'pascalCase',
    'constantCase',
  ];

  return (
    <div>
      <Card className="mb-24">
        <Input.TextArea
          size="large"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a string to convert..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          className="mb-24"
        />

        <div className={styles.resultContainer}>
          {conventionKeys.map((key) => (
            <ResultRow key={key} label={key} value={results[key]} />
          ))}
        </div>
      </Card>
    </div>
  );
}
