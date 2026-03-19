import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { MENU_CONFIG } from '../../constants/menuConfig';
import type { MenuItemConfig } from '../../constants/menuConfig';

const { Sider } = Layout;
import type { MenuProps } from 'antd';
type ItemType = NonNullable<MenuProps['items']>[number];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const collapsed = useAppStore((state) => state.sidebarCollapsed);

  const filterMenu = (items: MenuItemConfig[]): ItemType[] => {
    const result: ItemType[] = [];

    for (const item of items) {
      if (item.type === 'group' || item.type === 'sub') {
        const children = item.children ? filterMenu(item.children) : undefined;
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
        result.push({
          key: item.path || item.key,
          label: item.label,
          icon: item.icon,
          onClick: () => {
            if (item.path) {
              navigate(item.path);
            }
          },
        });
      }
    }

    return result;
  };

  const menuItems = filterMenu(MENU_CONFIG);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      trigger={null}
      width={260}
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
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: '0 24px',
          fontWeight: 'bold',
          fontSize: 18,
          borderBottom: '1px solid var(--ant-color-border-secondary)',
        }}
      >
        {collapsed ? 'GT' : 'Go Tool'}
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
