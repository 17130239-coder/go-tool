/**
 * Menu utility functions.
 *
 * Pure functions that operate on the menu constants defined in `constants/menuConfig`.
 * They power the sidebar, command palette, route generation, and tool settings.
 *
 * WORKFLOW:
 * ┌───────────────┐     ┌──────────────────┐     ┌──────────────────┐
 * │  menuConfig   │────▶│    menuUtil       │────▶│  Consumers       │
 * │  (data/types) │     │  (this file)      │     │  (Sidebar, Route │
 * └───────────────┘     └──────────────────┘     │   CommandPalette) │
 *                                                 └──────────────────┘
 */

import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import {
  MENU_CONFIG,
  NAVIGABLE_MENU_ITEMS,
  TOOL_MENU_ITEMS,
  TOOL_PATH_SET,
  TOOL_DEFAULT_ORDER_PATHS,
} from '../constants/menuConfig';
import type { MenuItemConfig, NavigableMenuItem } from '../constants/menuConfig';

// ---------------------------------------------------------------------------
// Internal look-up maps (created once at module load)
// ---------------------------------------------------------------------------

/** NavigableMenuItem by path — used for fast look-ups by `findNavigableItemByPath`. */
const TOOL_ITEM_BY_PATH = new Map(
  TOOL_MENU_ITEMS.map((item) => [item.path, item] as const),
);

/** Recursively collects all `isTool` items from the raw config tree. */
function collectToolConfigItems(items: MenuItemConfig[]): MenuItemConfig[] {
  return items.flatMap((item) => {
    const self = item.isTool && item.path ? [item] : [];
    const children = item.children ? collectToolConfigItems(item.children) : [];
    return [...self, ...children];
  });
}

/** Full MenuItemConfig (with icon, lazyComponent, etc.) by path — used for sidebar building. */
const TOOL_CONFIG_ITEM_BY_PATH = new Map(
  collectToolConfigItems(MENU_CONFIG).map((item) => [item.path, item] as const),
);

// ---------------------------------------------------------------------------
// Path sanitisation helpers
// ---------------------------------------------------------------------------

/**
 * Removes invalid or duplicate paths from a user-provided path list.
 * Only keeps paths that exist in TOOL_PATH_SET.
 */
function sanitizeToolPaths(paths: string[]): string[] {
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

/**
 * Normalises a user-provided tool order list.
 * - Removes invalid / duplicate entries.
 * - Appends any tools from the default list that are missing.
 */
export function normalizeToolOrderPaths(paths: string[]): string[] {
  const normalized = sanitizeToolPaths(paths);
  const missingDefaults = TOOL_DEFAULT_ORDER_PATHS.filter(
    (path) => !normalized.includes(path),
  );
  return [...normalized, ...missingDefaults];
}

/**
 * Normalises a user-provided hidden-tool list.
 * Simply removes invalid / duplicate entries.
 */
export function normalizeHiddenToolPaths(paths: string[]): string[] {
  return sanitizeToolPaths(paths);
}

// ---------------------------------------------------------------------------
// Sidebar menu builders
// ---------------------------------------------------------------------------

/**
 * Builds the sidebar menu config respecting the user's custom tool ordering and hidden preferences.
 *
 * Steps:
 * 1. Normalise the order (fill in any missing defaults).
 * 2. Filter out hidden tools.
 * 3. Replace the `tools` group's children with the customised list.
 */
export function buildSidebarMenuConfig(
  toolOrderPaths: string[],
  hiddenToolPaths: string[],
): MenuItemConfig[] {
  const orderedToolPaths = normalizeToolOrderPaths(toolOrderPaths);
  const hiddenToolPathSet = new Set(normalizeHiddenToolPaths(hiddenToolPaths));

  const orderedVisibleTools = orderedToolPaths
    .filter((path) => !hiddenToolPathSet.has(path))
    .map((path) => TOOL_CONFIG_ITEM_BY_PATH.get(path))
    .filter((item): item is MenuItemConfig => !!item);

  return MENU_CONFIG.map((group) => {
    // Only customise the "tools" group; other groups stay as-is
    if (group.key !== 'tools' || !group.children) {
      return group;
    }
    return { ...group, children: orderedVisibleTools };
  });
}

/**
 * Returns the visible tool items as flat `NavigableMenuItem[]` (for DashboardPage).
 */
export function buildVisibleToolItems(
  toolOrderPaths: string[],
  hiddenToolPaths: string[],
): NavigableMenuItem[] {
  const orderedToolPaths = normalizeToolOrderPaths(toolOrderPaths);
  const hiddenToolPathSet = new Set(normalizeHiddenToolPaths(hiddenToolPaths));

  return orderedToolPaths
    .filter((path) => !hiddenToolPathSet.has(path))
    .map((path) => TOOL_ITEM_BY_PATH.get(path))
    .filter((item): item is NavigableMenuItem => !!item);
}

/**
 * Returns all visible *navigable* items (tools + non-tools) for the CommandPalette.
 */
export function buildVisibleNavigableMenuItems(
  toolOrderPaths: string[],
  hiddenToolPaths: string[],
): NavigableMenuItem[] {
  const customisedConfig = buildSidebarMenuConfig(toolOrderPaths, hiddenToolPaths);
  return flattenNavigableItems(customisedConfig);
}

/** Finds a navigable item by its path (e.g. for setting `document.title`). */
export function findNavigableItemByPath(
  path: string,
): NavigableMenuItem | undefined {
  return NAVIGABLE_MENU_ITEMS.find((item) => item.path === path);
}

// ---------------------------------------------------------------------------
// Flattening helpers (shared between the builders above and menuConfig)
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

// ---------------------------------------------------------------------------
// Route generation
// ---------------------------------------------------------------------------

/** Recursively collects items that have both a `path` and a `lazyComponent`. */
function collectRoutableItems(items: MenuItemConfig[]): MenuItemConfig[] {
  return items.flatMap((item) => {
    const self = item.path && item.lazyComponent ? [item] : [];
    const children = item.children ? collectRoutableItems(item.children) : [];
    return [...self, ...children];
  });
}

/**
 * Generates React Router `RouteObject[]` from `MENU_CONFIG`.
 *
 * HOW IT WORKS:
 * 1. Collects every menu item that has a `lazyComponent`.
 * 2. For each item, creates a lazy route using `item.lazyComponent()`.
 * 3. Tool items (`isTool: true`) are automatically wrapped with `GuardComponent`
 *    so hidden tools redirect to the dashboard.
 * 4. Prepends the index redirect (`/ → /dashboard`) and appends a 404 catch-all.
 *
 * @param GuardComponent — Wrapper for tool routes (e.g. `HiddenToolRouteGuard`).
 * @param ErrorComponent — Shown when a route fails to load or for 404.
 */
export function buildRoutes(
  GuardComponent: React.ComponentType<{ children: React.ReactNode }>,
  ErrorComponent: React.ComponentType<{ message?: string }>,
): RouteObject[] {
  const routableItems = collectRoutableItems(MENU_CONFIG);

  // Generate one lazy route per routable menu item
  const pageRoutes: RouteObject[] = routableItems.map((item) => ({
    // Strip leading slash — React Router child routes use relative paths
    path: item.path!.replace(/^\//, ''),
    errorElement: React.createElement(ErrorComponent),
    lazy: async () => {
      const mod = await item.lazyComponent!();
      const PageComponent = mod.default;

      // Wrap tool pages with the guard so hidden tools redirect away
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
    // Default redirect: / → /dashboard
    {
      index: true,
      element: React.createElement(Navigate, { to: '/dashboard', replace: true }),
    },
    ...pageRoutes,
    // 404 catch-all
    {
      path: '*',
      element: React.createElement(ErrorComponent, { message: 'Page not found' }),
    },
  ];
}
