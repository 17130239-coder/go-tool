import { StarFilled } from '@ant-design/icons';
import { Layout, Menu, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResolvedTheme } from '../../hooks';
import { useAppStore } from '../../store';
import { buildSidebarMenuConfig } from '../../utils/menuUtil';
import { APP_TITLE, ASSETS, SIDEBAR_WIDTH, HEADER_HEIGHT } from '../../constants/appConfig';
import type { MenuItemConfig } from '../../constants/menuConfig';

const { Sider } = Layout;
type ItemType = NonNullable<MenuProps['items']>[number];

function filterMenuItems(
  items: MenuItemConfig[],
  favoritePathSet: Set<string>,
  onNavigate: (path: string) => void,
): ItemType[] {
  const result: ItemType[] = [];

  for (const item of items) {
    if (item.type === 'group' || item.type === 'sub') {
      const children = item.children
        ? filterMenuItems(item.children, favoritePathSet, onNavigate)
        : undefined;
      // Don't show empty groups
      if (children && children.length > 0) {
        result.push({
          key: item.key,
          type: item.type === 'group' ? 'group' : undefined,
          label: item.label,
          icon: item.icon,
          children,
        });
      }
    } else {
      const isFavorite = !!item.path && favoritePathSet.has(item.path);
      result.push({
        key: item.path || item.key,
        label: isFavorite ? (
          <Space size={6}>
            <span>{item.label}</span>
            <StarFilled style={{ color: 'var(--ant-color-warning)' }} />
          </Space>
        ) : item.label,
        icon: item.icon,
        onClick: () => {
          if (item.path) {
            onNavigate(item.path);
          }
        },
      });
    }
  }

  return result;
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const favoriteToolPaths = useAppStore((state) => state.favoriteToolPaths);
  const hiddenToolPaths = useAppStore((state) => state.hiddenToolPaths);
  const toolOrderPaths = useAppStore((state) => state.toolOrderPaths);
  const favoritePathSet = useMemo(() => new Set(favoriteToolPaths), [favoriteToolPaths]);
  const { resolvedTheme } = useResolvedTheme();

  const logoSrc = ASSETS.logo[resolvedTheme];
  const logoMarkSrc = ASSETS.logoMark[resolvedTheme];

  const sidebarMenuConfig = useMemo(
    () => buildSidebarMenuConfig(toolOrderPaths, hiddenToolPaths),
    [hiddenToolPaths, toolOrderPaths],
  );

  const menuItems = useMemo(
    () => filterMenuItems(sidebarMenuConfig, favoritePathSet, navigate),
    [favoritePathSet, navigate, sidebarMenuConfig],
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      trigger={null}
      width={SIDEBAR_WIDTH}
      theme="light"
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        boxShadow: '1px 0 2px 0 rgba(0,0,0,0.05)',
        zIndex: 10,
      }}
    >
      <div
        className="logo"
        style={{
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: '0 24px',
          fontWeight: 'bold',
          fontSize: 18,
          borderBottom: '1px solid var(--ant-color-border-secondary)',
        }}
      >
        <img
          src={collapsed ? logoMarkSrc : logoSrc}
          alt={APP_TITLE}
          style={{
            display: 'block',
            height: collapsed ? 28 : 24,
            width: 'auto',
          }}
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['dashboard', 'tools', 'settings']}
        items={menuItems}
        style={{ borderRight: 'none' }}
      />
    </Sider>
  );
}
