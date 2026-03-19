import { Layout, Button, Dropdown, Space, Breadcrumb } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../store';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

const { Header: AntHeader } = Layout;

export function Header() {
  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  const breadcrumbs = useBreadcrumb();

  const themeMenuItems: MenuProps['items'] = [
    { key: 'light', label: 'Light', onClick: () => setThemeMode('light') },
    { key: 'dark', label: 'Dark', onClick: () => setThemeMode('dark') },
    { key: 'system', label: 'System', onClick: () => setThemeMode('system') },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: 'var(--ant-color-bg-container)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
        zIndex: 9,
      }}
    >
      <Space size="large">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: '16px', width: 64, height: 64, marginLeft: -24 }}
        />
        <Breadcrumb items={breadcrumbs.map((b) => ({ title: b.title }))} />
      </Space>

      <Space size="middle">
        <Dropdown menu={{ items: themeMenuItems }} placement="bottomRight" arrow>
          <Button type="text" icon={<BgColorsOutlined />} />
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
