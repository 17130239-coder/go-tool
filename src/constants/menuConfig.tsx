import React from 'react';
import {
  ToolOutlined,
  BgColorsOutlined,
  NumberOutlined,
  EditOutlined,
  FileTextOutlined,
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
      {
        key: '/random-color',
        label: 'Random Color',
        icon: <BgColorsOutlined />,
        path: '/random-color',
      },
      {
        key: '/text-typing',
        label: 'Text Typing',
        icon: <EditOutlined />,
        path: '/text-typing',
      },
      {
        key: '/json-formatter',
        label: 'JSON Formatter',
        icon: <FileTextOutlined />,
        path: '/json-formatter',
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
