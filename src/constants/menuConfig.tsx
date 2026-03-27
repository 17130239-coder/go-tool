import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import {
  DashboardOutlined,
  ToolOutlined,
  BgColorsOutlined,
  NumberOutlined,
  EditOutlined,
  CalculatorOutlined,
  SettingOutlined,
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
  /** Lazy import for the page component. Return `{ default: ComponentType }`. */
  lazyComponent?: () => Promise<{ default: React.ComponentType }>;
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
        lazyComponent: () =>
          import('../features/dashboard/DashboardPage').then((m) => ({
            default: m.DashboardPage,
          })),
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
        lazyComponent: () =>
          import('../features/naming-converter/NamingConverterPage').then((m) => ({
            default: m.ConverterPage,
          })),
      },
      {
        key: '/random-number',
        label: 'Random Number',
        icon: <NumberOutlined />,
        path: '/random-number',
        description: 'Generate random integers from an inclusive range.',
        keywords: ['rng', 'number', 'range'],
        isTool: true,
        lazyComponent: () =>
          import('../features/random-number/RandomNumberPage').then((m) => ({
            default: m.RandomNumberPage,
          })),
      },
      {
        key: '/random-color',
        label: 'Color Converter',
        icon: <BgColorsOutlined />,
        path: '/random-color',
        description: 'Convert colors between HEX, RGB(A), and HSL(A).',
        keywords: ['hex', 'rgb', 'hsl', 'palette'],
        isTool: true,
        lazyComponent: () =>
          import('../features/random-color/RandomColorPage').then((m) => ({
            default: m.ColorConverterPage,
          })),
      },
      {
        key: '/text-typing',
        label: 'Text Typing',
        icon: <EditOutlined />,
        path: '/text-typing',
        description: 'Typing speed challenge with live WPM and accuracy.',
        keywords: ['typing', 'wpm', 'accuracy'],
        isTool: true,
        lazyComponent: () =>
          import('../features/text-typing/TextTypingPage').then((m) => ({
            default: m.TextTypingPage,
          })),
      },
      {
        key: '/gross-net-salary',
        label: 'Gross ↔ Net Salary',
        icon: <CalculatorOutlined />,
        path: '/gross-net-salary',
        description: 'Calculate gross/net salary breakdown for VN 2026.',
        keywords: ['salary', 'tax', 'insurance', 'gross', 'net'],
        isTool: true,
        lazyComponent: () =>
          import('../features/gross-net-salary/GrossNetSalaryPage').then((m) => ({
            default: m.GrossNetSalaryPage,
          })),
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    type: 'group',
    children: [
      {
        key: '/settings/sidebar',
        label: 'Sidebar Settings',
        icon: <SettingOutlined />,
        path: '/settings/sidebar',
        description: 'Configure tool visibility and ordering for sidebar links.',
        keywords: ['settings', 'sidebar', 'order', 'visibility', 'hide', 'show'],
        lazyComponent: () =>
          import('../features/sidebar-settings/SidebarSettingsPage').then((m) => ({
            default: m.SidebarSettingsPage,
          })),
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Navigable items (flattened)
// ---------------------------------------------------------------------------

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
      ? [
          {
            key: item.key,
            label: item.label,
            icon: item.icon,
            path: item.path,
            description: item.description,
            keywords: item.keywords,
            isTool: item.isTool ?? false,
          },
        ]
      : [];

    return [...selfItem, ...childItems];
  });
}

function collectToolConfigItems(items: MenuItemConfig[]): MenuItemConfig[] {
  return items.flatMap((item) => {
    const self = item.isTool && item.path ? [item] : [];
    const children = item.children ? collectToolConfigItems(item.children) : [];
    return [...self, ...children];
  });
}

export const NAVIGABLE_MENU_ITEMS: NavigableMenuItem[] = flattenNavigableItems(MENU_CONFIG);
export const TOOL_MENU_ITEMS: NavigableMenuItem[] = NAVIGABLE_MENU_ITEMS.filter(
  (item) => item.isTool,
);
export const TOOL_PATH_SET = new Set(TOOL_MENU_ITEMS.map((item) => item.path));
export const TOOL_DEFAULT_ORDER_PATHS = TOOL_MENU_ITEMS.map((item) => item.path);
const TOOL_ITEM_BY_PATH = new Map(
  TOOL_MENU_ITEMS.map((item) => [item.path, item] as const),
);

const TOOL_CONFIG_ITEM_BY_PATH = new Map(
  collectToolConfigItems(MENU_CONFIG).map((item) => [item.path, item] as const),
);

function sanitizeToolPaths(paths: string[]) {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const path of paths) {
    if (!TOOL_PATH_SET.has(path) || seen.has(path)) {
      continue;
    }

    seen.add(path);
    result.push(path);
  }

  return result;
}

export function normalizeToolOrderPaths(paths: string[]) {
  const normalized = sanitizeToolPaths(paths);
  const missingDefaults = TOOL_DEFAULT_ORDER_PATHS.filter(
    (path) => !normalized.includes(path),
  );
  return [...normalized, ...missingDefaults];
}

export function normalizeHiddenToolPaths(paths: string[]) {
  return sanitizeToolPaths(paths);
}

export function buildSidebarMenuConfig(
  toolOrderPaths: string[],
  hiddenToolPaths: string[],
) {
  const orderedToolPaths = normalizeToolOrderPaths(toolOrderPaths);
  const hiddenToolPathSet = new Set(normalizeHiddenToolPaths(hiddenToolPaths));

  const orderedVisibleTools = orderedToolPaths
    .filter((path) => !hiddenToolPathSet.has(path))
    .map((path) => TOOL_CONFIG_ITEM_BY_PATH.get(path))
    .filter((item): item is MenuItemConfig => !!item);

  return MENU_CONFIG.map((item) => {
    if (item.key !== 'tools' || !item.children) {
      return item;
    }

    return {
      ...item,
      children: orderedVisibleTools,
    };
  });
}

export function buildVisibleToolItems(
  toolOrderPaths: string[],
  hiddenToolPaths: string[],
) {
  const orderedToolPaths = normalizeToolOrderPaths(toolOrderPaths);
  const hiddenToolPathSet = new Set(normalizeHiddenToolPaths(hiddenToolPaths));

  return orderedToolPaths
    .filter((path) => !hiddenToolPathSet.has(path))
    .map((path) => TOOL_ITEM_BY_PATH.get(path))
    .filter((item): item is NavigableMenuItem => !!item);
}

export function buildVisibleNavigableMenuItems(
  toolOrderPaths: string[],
  hiddenToolPaths: string[],
) {
  const customizedConfig = buildSidebarMenuConfig(toolOrderPaths, hiddenToolPaths);
  return flattenNavigableItems(customizedConfig);
}

export function findNavigableItemByPath(path: string) {
  return NAVIGABLE_MENU_ITEMS.find((item) => item.path === path);
}

// ---------------------------------------------------------------------------
// Route generation — builds React Router routes from MENU_CONFIG
// ---------------------------------------------------------------------------

function collectRoutableItems(items: MenuItemConfig[]): MenuItemConfig[] {
  return items.flatMap((item) => {
    const self = item.path && item.lazyComponent ? [item] : [];
    const children = item.children ? collectRoutableItems(item.children) : [];
    return [...self, ...children];
  });
}

/**
 * Generates React Router route objects from MENU_CONFIG.
 * Tool items (`isTool: true`) are automatically wrapped with the provided GuardComponent.
 */
export function buildRoutes(
  GuardComponent: React.ComponentType<{ children: React.ReactNode }>,
  ErrorComponent: React.ComponentType<{ message?: string }>,
): RouteObject[] {
  const routableItems = collectRoutableItems(MENU_CONFIG);

  const pageRoutes: RouteObject[] = routableItems.map((item) => ({
    path: item.path!.replace(/^\//, ''),
    errorElement: React.createElement(ErrorComponent),
    lazy: async () => {
      const mod = await item.lazyComponent!();
      const PageComponent = mod.default;

      if (item.isTool) {
        return {
          Component: () =>
            React.createElement(
              GuardComponent,
              null,
              React.createElement(PageComponent),
            ),
        };
      }

      return { Component: PageComponent };
    },
  }));

  return [
    {
      index: true,
      element: React.createElement(Navigate, { to: '/dashboard', replace: true }),
    },
    ...pageRoutes,
    {
      path: '*',
      element: React.createElement(ErrorComponent, { message: 'Page not found' }),
    },
  ];
}
