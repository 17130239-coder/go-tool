import { Modal, Space, Table, Typography } from 'antd';

const { Text } = Typography;

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutRow {
  key: string;
  shortcut: string;
  description: string;
}

const SHORTCUTS: ShortcutRow[] = [
  { key: 'command-palette', shortcut: 'Cmd/Ctrl + K', description: 'Open command palette' },
  { key: 'shortcuts-help', shortcut: '?', description: 'Open keyboard shortcuts help' },
  { key: 'close-overlay', shortcut: 'Esc', description: 'Close active modal/overlay' },
];

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Keyboard Shortcuts"
      width={620}
      destroyOnClose
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text type="secondary">
          Use these shortcuts anywhere in the app to navigate faster.
        </Text>
        <Table<ShortcutRow>
          rowKey="key"
          dataSource={SHORTCUTS}
          pagination={false}
          columns={[
            {
              title: 'Shortcut',
              dataIndex: 'shortcut',
              key: 'shortcut',
              width: 180,
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description',
            },
          ]}
          size="small"
        />
      </Space>
    </Modal>
  );
}
