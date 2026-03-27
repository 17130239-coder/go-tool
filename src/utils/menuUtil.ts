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
// Internal helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Public utility functions
// ---------------------------------------------------------------------------

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
