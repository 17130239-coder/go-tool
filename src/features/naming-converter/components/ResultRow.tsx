import { Input, Typography } from 'antd';
import { CopyButton } from '../../../components/shared';
import styles from '../NamingConverter.module.css';
import type { ConventionType } from '../types';

const { Text } = Typography;

interface ResultRowProps {
  label: ConventionType;
  value: string;
  copied: boolean;
  onCopy: () => void;
}

export function ResultRow({ label, value, copied, onCopy }: ResultRowProps) {
  const getLabel = (type: ConventionType) => {
    switch (type) {
      case 'camelCase': return 'camelCase';
      case 'kebabCase': return 'kebab-case';
      case 'snakeCase': return 'snake_case';
      case 'pascalCase': return 'PascalCase';
      case 'constantCase': return 'CONSTANT_CASE';
      default: return type;
    }
  };

  return (
    <div className={styles.resultRow}>
      <div className={styles.resultLabel}>
        <Text type="secondary">{getLabel(label)}</Text>
      </div>
      <div className={styles.resultValue}>
        <Input value={value} readOnly variant="borderless" style={{ fontWeight: 500 }} />
      </div>
      <div>
        <CopyButton copied={copied} onCopy={onCopy} disabled={!value} />
      </div>
    </div>
  );
}
