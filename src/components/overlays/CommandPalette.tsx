import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Empty, Input, List, Modal, Space, Tag, Typography } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { NAVIGABLE_MENU_ITEMS } from '../../constants/menuConfig';
import { useAppStore } from '../../store';

const { Text } = Typography;

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<InputRef>(null);

  const favoriteToolPaths = useAppStore((state) => state.favoriteToolPaths);
  const toggleFavoriteTool = useAppStore((state) => state.toggleFavoriteTool);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return NAVIGABLE_MENU_ITEMS;
    }

    return NAVIGABLE_MENU_ITEMS.filter((item) => {
      const haystacks = [item.label, item.description || '', ...(item.keywords || [])]
        .join(' ')
        .toLowerCase();
      return haystacks.includes(normalized);
    });
  }, [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open]);

  const handleOpen = (path: string) => {
    navigate(path);
    setQuery('');
    setActiveIndex(0);
    onClose();
  };

  const handleClose = () => {
    setQuery('');
    setActiveIndex(0);
    onClose();
  };

  const safeActiveIndex = filteredItems.length > 0
    ? Math.min(activeIndex, filteredItems.length - 1)
    : 0;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title="Command Palette"
      width={720}
      destroyOnClose
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input
          ref={inputRef}
          placeholder="Search tools by name, keyword, or description..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          prefix={<SearchOutlined />}
          onKeyDown={(event) => {
            if (filteredItems.length === 0) {
              return;
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((prev) => (prev + 1) % filteredItems.length);
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
            }

            if (event.key === 'Enter') {
              event.preventDefault();
              const activeItem = filteredItems[safeActiveIndex];
              if (activeItem) {
                handleOpen(activeItem.path);
              }
            }
          }}
        />

        {filteredItems.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No tools matched your search." />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredItems}
            renderItem={(item, index) => (
              <List.Item
                style={
                  index === safeActiveIndex
                    ? { background: 'var(--ant-color-fill-quaternary)', borderRadius: 8, paddingInline: 12 }
                    : undefined
                }
                actions={[
                  <Button key={`open-${item.path}`} type="link" onClick={() => handleOpen(item.path)}>
                    Open
                  </Button>,
                  ...(item.isTool
                    ? [
                        <Button
                          key={`favorite-${item.path}`}
                          icon={favoriteToolPaths.includes(item.path) ? <StarFilled /> : <StarOutlined />}
                          onClick={() => toggleFavoriteTool(item.path)}
                        />,
                      ]
                    : []),
                ]}
              >
                <List.Item.Meta
                  avatar={item.icon}
                  title={item.label}
                  description={
                    <Space size={4} wrap>
                      <Text type="secondary">{item.description || 'No description'}</Text>
                      {favoriteToolPaths.includes(item.path) && <Tag color="gold">Favorite</Tag>}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Space>
    </Modal>
  );
}
