import { ArrowDownOutlined, ArrowUpOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, List, Space, Switch, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { FeatureCard, PageHeader, PageSectionTitle } from '../../../components/shared';
import { TOOL_MENU_ITEMS, normalizeToolOrderPaths } from '../../../constants/menuConfig';
import { useAppStore } from '../../../store';

const { Text } = Typography;

export function SidebarSettingsPage() {
  const hiddenToolPaths = useAppStore((state) => state.hiddenToolPaths);
  const toolOrderPaths = useAppStore((state) => state.toolOrderPaths);
  const toggleToolVisibility = useAppStore((state) => state.toggleToolVisibility);
  const moveToolOrderPath = useAppStore((state) => state.moveToolOrderPath);
  const resetSidebarToolPreferences = useAppStore((state) => state.resetSidebarToolPreferences);

  const hiddenToolPathSet = useMemo(() => new Set(hiddenToolPaths), [hiddenToolPaths]);
  const orderedToolPaths = useMemo(() => normalizeToolOrderPaths(toolOrderPaths), [toolOrderPaths]);

  const orderedTools = useMemo(
    () =>
      orderedToolPaths
        .map((path) => TOOL_MENU_ITEMS.find((item) => item.path === path))
        .filter((item): item is NonNullable<typeof item> => !!item),
    [orderedToolPaths],
  );

  return (
    <FeatureCard>
      <PageHeader
        title="Sidebar Settings"
        description="Configure which tools appear in the sidebar and adjust their display order."
      />

      <Card size="small">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <PageSectionTitle>Tool visibility and order</PageSectionTitle>

          <List
            itemLayout="horizontal"
            dataSource={orderedTools}
            renderItem={(tool, index) => {
              const isVisible = !hiddenToolPathSet.has(tool.path);
              const canMoveUp = index > 0;
              const canMoveDown = index < orderedTools.length - 1;

              return (
                <List.Item
                  actions={[
                    <Switch
                      key={`visibility-${tool.path}`}
                      checked={isVisible}
                      checkedChildren="Visible"
                      unCheckedChildren="Hidden"
                      onChange={() => toggleToolVisibility(tool.path)}
                    />,
                    <Button
                      key={`up-${tool.path}`}
                      icon={<ArrowUpOutlined />}
                      onClick={() => moveToolOrderPath(tool.path, 'up')}
                      disabled={!canMoveUp}
                      aria-label={`Move ${tool.label} up`}
                    />,
                    <Button
                      key={`down-${tool.path}`}
                      icon={<ArrowDownOutlined />}
                      onClick={() => moveToolOrderPath(tool.path, 'down')}
                      disabled={!canMoveDown}
                      aria-label={`Move ${tool.label} down`}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={tool.icon}
                    title={
                      <Space size={8}>
                        <span>{tool.label}</span>
                        {isVisible ? <Tag color="green">Visible</Tag> : <Tag color="default">Hidden</Tag>}
                      </Space>
                    }
                    description={
                      <Text type="secondary">{tool.description || 'No description available.'}</Text>
                    }
                  />
                </List.Item>
              );
            }}
          />

          <Space>
            <Button icon={<ReloadOutlined />} onClick={resetSidebarToolPreferences}>
              Reset to default
            </Button>
          </Space>
        </Space>
      </Card>
    </FeatureCard>
  );
}
