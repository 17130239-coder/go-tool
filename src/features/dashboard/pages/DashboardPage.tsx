import { useMemo } from 'react';
import { Button, Card, Empty, Flex, List, Space, Tag, Typography } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FeatureCard, PageHeader, PageSectionTitle } from '../../../components/shared';
import { TOOL_MENU_ITEMS, findNavigableItemByPath } from '../../../constants/menuConfig';
import { useAppStore } from '../../../store';

const { Text } = Typography;

function formatUsedAt(value: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export function DashboardPage() {
  const navigate = useNavigate();

  const favoriteToolPaths = useAppStore((state) => state.favoriteToolPaths);
  const recentToolUsage = useAppStore((state) => state.recentToolUsage);
  const toggleFavoriteTool = useAppStore((state) => state.toggleFavoriteTool);

  const favoriteTools = useMemo(
    () => TOOL_MENU_ITEMS.filter((tool) => favoriteToolPaths.includes(tool.path)),
    [favoriteToolPaths],
  );

  const recentTools = useMemo(
    () =>
      recentToolUsage
        .map((entry) => {
          const tool = findNavigableItemByPath(entry.path);
          if (!tool || !tool.isTool) {
            return null;
          }

          return {
            ...tool,
            usedAt: entry.usedAt,
          };
        })
        .filter((item): item is NonNullable<typeof item> => !!item),
    [recentToolUsage],
  );

  const quickActions = TOOL_MENU_ITEMS.slice(0, 4);

  return (
    <FeatureCard>
      <PageHeader
        title="Dashboard"
        description="Quickly jump into your tools, manage favorites, and resume recent work."
      />

      <Card size="small">
        <Flex vertical gap={12}>
          <PageSectionTitle>Quick Actions</PageSectionTitle>
          <Space wrap>
            {quickActions.map((tool) => (
              <Button
                key={tool.path}
                icon={tool.icon}
                onClick={() => navigate(tool.path)}
                type="default"
              >
                {tool.label}
              </Button>
            ))}
          </Space>
        </Flex>
      </Card>

      <Card size="small">
        <Flex vertical gap={8}>
          <PageSectionTitle>Favorite Tools</PageSectionTitle>
          {favoriteTools.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No favorites yet. Mark tools with the star button."
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={favoriteTools}
              renderItem={(tool) => (
                <List.Item
                  actions={[
                    <Button key={`open-${tool.path}`} type="link" onClick={() => navigate(tool.path)}>
                      Open
                    </Button>,
                    <Button
                      key={`toggle-${tool.path}`}
                      icon={favoriteToolPaths.includes(tool.path) ? <StarFilled /> : <StarOutlined />}
                      onClick={() => toggleFavoriteTool(tool.path)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={tool.icon}
                    title={tool.label}
                    description={tool.description || 'No description'}
                  />
                </List.Item>
              )}
            />
          )}
        </Flex>
      </Card>

      <Card size="small">
        <Flex vertical gap={8}>
          <PageSectionTitle>Recently Used Tools</PageSectionTitle>
          {recentTools.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Start using a tool to populate history." />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={recentTools}
              renderItem={(tool) => (
                <List.Item
                  actions={[
                    <Tag key={`used-${tool.path}`}>{formatUsedAt(tool.usedAt)}</Tag>,
                    <Button key={`recent-open-${tool.path}`} type="link" onClick={() => navigate(tool.path)}>
                      Open
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={tool.icon}
                    title={tool.label}
                    description={
                      <Space size={4} wrap>
                        <Text type="secondary">{tool.description || 'No description'}</Text>
                        {favoriteToolPaths.includes(tool.path) && <Tag color="gold">Favorite</Tag>}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Flex>
      </Card>
    </FeatureCard>
  );
}
