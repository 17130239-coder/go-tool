import { Button, Space } from 'antd';
import {
  FormatPainterOutlined,
  CompressOutlined,
  ClearOutlined,
} from '@ant-design/icons';

interface FormatterActionsProps {
  onFormat: () => void;
  onMinify?: () => void;
  onClear: () => void;
  formatDisabled?: boolean;
  minifyDisabled?: boolean;
  formatLabel?: string;
  minifyLabel?: string;
  clearLabel?: string;
  showMinify?: boolean;
}

export function FormatterActions({
  onFormat,
  onMinify,
  onClear,
  formatDisabled = false,
  minifyDisabled = false,
  formatLabel = 'Format',
  minifyLabel = 'Minify',
  clearLabel = 'Clear',
  showMinify = true,
}: FormatterActionsProps) {
  return (
    <Space wrap>
      <Button
        type="primary"
        icon={<FormatPainterOutlined />}
        onClick={onFormat}
        disabled={formatDisabled}
      >
        {formatLabel}
      </Button>

      {showMinify && onMinify && (
        <Button
          icon={<CompressOutlined />}
          onClick={onMinify}
          disabled={minifyDisabled}
        >
          {minifyLabel}
        </Button>
      )}

      <Button icon={<ClearOutlined />} onClick={onClear}>
        {clearLabel}
      </Button>
    </Space>
  );
}
