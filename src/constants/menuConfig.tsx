import React from 'react';
import {
  ToolOutlined,
  NumberOutlined,
} from '@ant-design/icons';

export interface MenuItemConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  type?: 'group' | 'sub';
  children?: MenuItemConfig[];
}

export const MENU_CONFIG: MenuItemConfig[] = [
  // {
  //   key: 'dashboard',
  //   label: 'Dashboard',
  //   type: 'group',
  //   children: [
  //     {
  //       key: '/dashboard',
  //       label: 'Dashboard',
  //       icon: <DashboardOutlined />,
  //       path: '/dashboard',
  //     },
  //   ],
  // },
  {
    key: 'tools',
    label: 'Tools & Utilities',
    type: 'group',
    children: [
      {
        key: '/naming-converter',
        label: 'Naming Converter',
        icon: <ToolOutlined />,
        path: '/naming-converter',
      },
      {
        key: '/random-number',
        label: 'Random Number',
        icon: <NumberOutlined />,
        path: '/random-number',
      },
    ],
  },
  // {
  //   key: 'settings',
  //   label: 'Settings',
  //   type: 'group',
  //   children: [
  //     {
  //       key: '/categories',
  //       label: 'Categories',
  //       icon: <AppstoreOutlined />,
  //       path: '/categories',
  //     },
  //     {
  //       key: '/permissions',
  //       label: 'Permissions',
  //       icon: <SettingOutlined />,
  //       path: '/permissions',
  //     },
  //   ],
  // },
];
