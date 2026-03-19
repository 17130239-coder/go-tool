import { Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface CopyButtonProps {
  copied: boolean;
  onCopy: () => void;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
}

export function CopyButton({ copied, onCopy, size = 'small', disabled }: CopyButtonProps) {
  return (
    <Button
      size={size}
      icon={<CopyOutlined />}
      onClick={onCopy}
      type={copied ? 'primary' : 'default'}
      disabled={disabled}
    >
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
