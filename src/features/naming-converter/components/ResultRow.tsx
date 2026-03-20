import { Card, Flex, Input, Typography } from 'antd';
import { CopyButton } from '../../../components/shared';
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
    <Card size="small">
      <Flex align="center" gap={12} wrap>
        <Flex style={{ minWidth: 160 }}>
        <Text type="secondary">{getLabel(label)}</Text>
        </Flex>
        <Flex flex={1}>
          <Input value={value} readOnly style={{ fontWeight: 500 }} />
        </Flex>
        <CopyButton copied={copied} onCopy={onCopy} disabled={!value} />
      </Flex>
    </Card>
  );
}
