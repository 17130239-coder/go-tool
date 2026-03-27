/**
 * Menu configuration — the single source of truth for all pages in the app.
 *
 * HOW IT WORKS:
 * 1. Every page (tool, dashboard, settings) is declared as a `MenuItemConfig` entry inside
 *    `MENU_CONFIG`, complete with its path, label, icon, keywords, and a `lazyComponent`
 *    pointing to the React page component.
 * 2. Derived constants (`NAVIGABLE_MENU_ITEMS`, `TOOL_MENU_ITEMS`, `TOOL_PATH_SET`, etc.)
 *    are computed once at module load from `MENU_CONFIG`.
 * 3. Utility functions in `utils/menuUtil.ts` consume these constants to build sidebar menus,
 *    generate routes, and look up items by path.
 *
 * ADDING A NEW FEATURE:
 * Simply add a new entry to `MENU_CONFIG` with the required fields (path, label, icon,
 * lazyComponent). Everything else (routing, sidebar, command palette, page title) picks it up
 * automatically.
 */

import React from 'react';
import {
  DashboardOutlined,
  ToolOutlined,
  BgColorsOutlined,
  NumberOutlined,
  EditOutlined,
  CalculatorOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for a single menu / page entry. */
export interface MenuItemConfig {
  /** Unique key used by Ant Design Menu and as a React key. */
  key: string;
  /** Human-readable label shown in the sidebar and command palette. */
  label: string;
  /** Optional Ant Design icon rendered beside the label. */
  icon?: React.ReactNode;
  /** URL path (e.g. '/random-color'). Omit for non-navigable group headers. */
  path?: string;
  /** 'group' = visual group header, 'sub' = collapsible sub-menu. */
  type?: 'group' | 'sub';
  /** Short description shown in the command palette and dashboard. */
  description?: string;
  /** Search keywords for the command palette fuzzy search. */
  keywords?: string[];
  /** If `true`, this page is a "tool" that can be hidden/reordered via settings. */
  isTool?: boolean;
  /** Nested children (groups → items). */
  children?: MenuItemConfig[];
  /**
   * Lazy import function returning `{ default: ComponentType }`.
   * Used by `buildRoutes()` to create lazy-loaded React Router routes.
   */
  lazyComponent?: () => Promise<{ default: React.ComponentType }>;
}

/** Flattened, navigable version of a `MenuItemConfig` (always has a `path`). */
export interface NavigableMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  description?: string;
  keywords?: string[];
  isTool: boolean;
}

// ---------------------------------------------------------------------------
// Menu configuration
// ---------------------------------------------------------------------------

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
// Derived constants (computed once at module load)
// ---------------------------------------------------------------------------

/** Recursively flattens `MenuItemConfig[]` into navigable leaf items. */
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

/** All items that have a navigable `path`. */
export const NAVIGABLE_MENU_ITEMS: NavigableMenuItem[] =
  flattenNavigableItems(MENU_CONFIG);

/** Subset of navigable items where `isTool` is true. */
export const TOOL_MENU_ITEMS: NavigableMenuItem[] = NAVIGABLE_MENU_ITEMS.filter(
  (item) => item.isTool,
);

/** Fast lookup set for checking whether a path belongs to a tool. */
export const TOOL_PATH_SET = new Set(TOOL_MENU_ITEMS.map((item) => item.path));

/** Default ordering of tool paths (matches declaration order in MENU_CONFIG). */
export const TOOL_DEFAULT_ORDER_PATHS = TOOL_MENU_ITEMS.map((item) => item.path);
