import { Input, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  hasError?: boolean;
}

export function InputSection({
  value,
  onChange,
  label = 'Input',
  placeholder,
  minRows = 8,
  maxRows = 20,
  hasError = false,
}: InputSectionProps) {
  return (
    <div>
      <Text strong className="mb-8" style={{ display: 'block' }}>
        {label}
      </Text>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoSize={{ minRows, maxRows }}
        status={hasError ? 'error' : undefined}
      />
    </div>
  );
}
