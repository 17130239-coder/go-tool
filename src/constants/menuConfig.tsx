import React from 'react';
import {
  DashboardOutlined,
  ToolOutlined,
  BgColorsOutlined,
  NumberOutlined,
  EditOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';

export interface MenuItemConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  type?: 'group' | 'sub';
  description?: string;
  keywords?: string[];
  isTool?: boolean;
  children?: MenuItemConfig[];
}

export const MENU_CONFIG: MenuItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    type: 'group',
    children: [
      {
        key: '/dashboard',
        label: 'Dashboard',
        icon: <DashboardOutlined />,
        path: '/dashboard',
        description: 'Overview with quick actions, favorites, and recently used tools.',
        keywords: ['home', 'overview'],
      },
    ],
  },
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
        description: 'Convert text across common naming conventions.',
        keywords: ['camel', 'snake', 'kebab', 'pascal'],
        isTool: true,
      },
      {
        key: '/random-number',
        label: 'Random Number',
        icon: <NumberOutlined />,
        path: '/random-number',
        description: 'Generate random integers from an inclusive range.',
        keywords: ['rng', 'number', 'range'],
        isTool: true,
      },
      {
        key: '/random-color',
        label: 'Color Converter',
        icon: <BgColorsOutlined />,
        path: '/random-color',
        description: 'Convert colors between HEX, RGB(A), and HSL(A).',
        keywords: ['hex', 'rgb', 'hsl', 'palette'],
        isTool: true,
      },
      {
        key: '/text-typing',
        label: 'Text Typing',
        icon: <EditOutlined />,
        path: '/text-typing',
        description: 'Typing speed challenge with live WPM and accuracy.',
        keywords: ['typing', 'wpm', 'accuracy'],
        isTool: true,
      },
      {
        key: '/json-formatter',
        label: 'JSON Formatter',
        icon: <FileTextOutlined />,
        path: '/json-formatter',
        description: 'Validate, format, and minify JSON payloads.',
        keywords: ['json', 'format', 'minify', 'beautify'],
        isTool: true,
      },
      {
        key: '/sql-formatter',
        label: 'SQL Formatter',
        icon: <DatabaseOutlined />,
        path: '/sql-formatter',
        description: 'Format and review SQL queries across dialects.',
        keywords: ['sql', 'query', 'database', 'minify'],
        isTool: true,
      },
      {
        key: '/gross-net-salary',
        label: 'Gross ↔ Net Salary',
        icon: <CalculatorOutlined />,
        path: '/gross-net-salary',
        description: 'Calculate gross/net salary breakdown for VN 2026.',
        keywords: ['salary', 'tax', 'insurance', 'gross', 'net'],
        isTool: true,
      },
    ],
  },
];

export interface NavigableMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  description?: string;
  keywords?: string[];
  isTool: boolean;
}

function flattenNavigableItems(items: MenuItemConfig[]): NavigableMenuItem[] {
  return items.flatMap((item) => {
    const childItems = item.children ? flattenNavigableItems(item.children) : [];
    const selfItem: NavigableMenuItem[] = item.path
      ? [{
          key: item.key,
          label: item.label,
          icon: item.icon,
          path: item.path,
          description: item.description,
          keywords: item.keywords,
          isTool: item.isTool ?? false,
        }]
      : [];

    return [...selfItem, ...childItems];
  });
}

export const NAVIGABLE_MENU_ITEMS: NavigableMenuItem[] = flattenNavigableItems(MENU_CONFIG);
export const TOOL_MENU_ITEMS: NavigableMenuItem[] = NAVIGABLE_MENU_ITEMS.filter((item) => item.isTool);
export const TOOL_PATH_SET = new Set(TOOL_MENU_ITEMS.map((item) => item.path));

export function findNavigableItemByPath(path: string) {
  return NAVIGABLE_MENU_ITEMS.find((item) => item.path === path);
}
