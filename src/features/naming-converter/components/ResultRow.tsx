import { Button, Input, message, Tooltip, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import styles from '../NamingConverter.module.css';
import type { ConventionType } from '../types';

const { Text } = Typography;

interface ResultRowProps {
  label: ConventionType;
  value: string;
}

export function ResultRow({ label, value }: ResultRowProps) {
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      message.success('Copied!');
    });
  };

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
        <Tooltip title="Copy">
          <Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!value} />
        </Tooltip>
      </div>
    </div>
  );
}
