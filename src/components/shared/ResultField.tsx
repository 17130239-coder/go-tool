import { Input, Space, Typography } from 'antd';
import { CopyButton } from './CopyButton';

const { Text } = Typography;

interface ResultFieldProps {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  labelWidth?: number;
}

/** Labelled read-only input with a copy button. Used for displaying conversion results. */
export function ResultField({
  label,
  value,
  copied,
  onCopy,
  labelWidth = 80,
}: ResultFieldProps) {
  return (
    <Space
      align="center"
      style={{ width: '100%', justifyContent: 'space-between' }}
      wrap
      size="middle"
    >
      <Text
        type="secondary"
        style={{ minWidth: labelWidth, textTransform: 'uppercase' }}
      >
        {label}
      </Text>
      <Space style={{ flex: 1 }} size="small">
        <Input value={value} readOnly style={{ fontFamily: 'monospace' }} />
        <CopyButton copied={copied} onCopy={onCopy} disabled={!value} />
      </Space>
    </Space>
  );
}
