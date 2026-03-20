import { Card, Flex, Input, Typography } from 'antd';
import { CopyButton } from './CopyButton';

const { TextArea } = Input;
const { Text } = Typography;

interface OutputSectionProps {
  value: string;
  copied: boolean;
  onCopy: () => void;
  label?: string;
  minRows?: number;
  maxRows?: number;
  showCopyButton?: boolean;
}

export function OutputSection({
  value,
  copied,
  onCopy,
  label = 'Output',
  minRows = 8,
  maxRows = 20,
  showCopyButton = true,
}: OutputSectionProps) {
  if (!value) return null;

  return (
    <Card size="small">
      <Flex vertical gap={8}>
        <Flex align="center" gap={8} wrap>
        <Text strong>{label}</Text>
        {showCopyButton && <CopyButton copied={copied} onCopy={onCopy} />}
        </Flex>
      <TextArea
        value={value}
        readOnly
        autoSize={{ minRows, maxRows }}
        style={{ fontFamily: 'monospace' }}
      />
      </Flex>
    </Card>
  );
}
