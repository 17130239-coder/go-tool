import { MenuOutlined, ReloadOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Space, Switch, Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import type { CSSProperties, HTMLAttributes } from 'react';
import { useCallback, useMemo } from 'react';
import { FeatureCard, PageHeader, PageSectionTitle } from '../../components/shared';
import { TOOL_MENU_ITEMS } from '../../constants/menuConfig';
import { normalizeToolOrderPaths } from '../../utils/menuUtil';
import { useAppStore } from '../../store';

const { Text } = Typography;

interface TableRowData {
  key: string;
  path: string;
}

function DragHandle() {
  return (
    <Button type="text" icon={<MenuOutlined />} aria-label="Drag row to reorder tool" />
  );
}

type DragTableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  'data-row-key': string;
};

function DragSortableRow({ style, ...rest }: DragTableRowProps) {
  const rowKey = rest['data-row-key'];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rowKey,
  });

  const rowStyle: CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 1 } : {}),
  };

  return <tr ref={setNodeRef} style={rowStyle} {...rest} {...attributes} {...listeners} />;
}

export function SidebarSettingsPage() {
  const hiddenToolPaths = useAppStore((state) => state.hiddenToolPaths);
  const toolOrderPaths = useAppStore((state) => state.toolOrderPaths);
  const toggleToolVisibility = useAppStore((state) => state.toggleToolVisibility);
  const setToolOrderPaths = useAppStore((state) => state.setToolOrderPaths);
  const resetSidebarToolPreferences = useAppStore((state) => state.resetSidebarToolPreferences);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const hiddenToolPathSet = useMemo(() => new Set(hiddenToolPaths), [hiddenToolPaths]);
  const orderedToolPaths = useMemo(() => normalizeToolOrderPaths(toolOrderPaths), [toolOrderPaths]);

  const orderedTools = useMemo(
    () =>
      orderedToolPaths
        .map((path) => TOOL_MENU_ITEMS.find((item) => item.path === path))
        .filter((item): item is NonNullable<typeof item> => !!item),
    [orderedToolPaths],
  );

  const dataSource = useMemo<TableRowData[]>(
    () => orderedTools.map((tool) => ({ key: tool.path, path: tool.path })),
    [orderedTools],
  );

  const toolByPath = useMemo(() => new Map(orderedTools.map((tool) => [tool.path, tool])), [orderedTools]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = orderedToolPaths.indexOf(String(active.id));
      const newIndex = orderedToolPaths.indexOf(String(over.id));
      if (oldIndex < 0 || newIndex < 0) {
        return;
      }

      setToolOrderPaths(arrayMove(orderedToolPaths, oldIndex, newIndex));
    },
    [orderedToolPaths, setToolOrderPaths],
  );

  const columns: TableColumnsType<TableRowData> = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'path',
        width: 56,
        render: () => <DragHandle />,
      },
      {
        title: 'Tool',
        dataIndex: 'path',
        render: (path: string) => {
          const tool = toolByPath.get(path);
          if (!tool) {
            return null;
          }

          const isVisible = !hiddenToolPathSet.has(path);
          return (
            <Space size={8}>
              {tool.icon}
              <span>{tool.label}</span>
              {isVisible ? <Tag color="green">Visible</Tag> : <Tag>Hidden</Tag>}
            </Space>
          );
        },
      },
      {
        title: 'Description',
        dataIndex: 'path',
        render: (path: string) => {
          const tool = toolByPath.get(path);
          return <Text type="secondary">{tool?.description || 'No description available.'}</Text>;
        },
      },
      {
        title: 'Visibility',
        dataIndex: 'path',
        width: 140,
        render: (path: string) => (
          <Switch
            checked={!hiddenToolPathSet.has(path)}
            checkedChildren="Visible"
            unCheckedChildren="Hidden"
            onChange={() => toggleToolVisibility(path)}
          />
        ),
      },
    ],
    [hiddenToolPathSet, toggleToolVisibility, toolByPath],
  );

  return (
    <FeatureCard>
      <PageHeader
        title="Sidebar Settings"
        description="Configure which tools appear in the sidebar and drag rows in the table to reorder them."
      />

      <Card size="small">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <PageSectionTitle>Tool visibility and order</PageSectionTitle>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={dataSource.map((item) => item.key)} strategy={verticalListSortingStrategy}>
              <Table<TableRowData>
                rowKey="key"
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                components={{
                  body: {
                    row: DragSortableRow,
                  },
                }}
              />
            </SortableContext>
          </DndContext>

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
