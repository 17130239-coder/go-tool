import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MENU_CONFIG } from '../constants/menuConfig';
import type { MenuItemConfig } from '../constants/menuConfig';

/**
 * Builds a breadcrumb trail from the current URL path.
 *
 * Walks the `MENU_CONFIG` tree to find the matching item, then returns an
 * array of `{ title, path? }` objects suitable for Ant Design's `<Breadcrumb>`.
 * Falls back to `[{ title: 'Dashboard' }]` if no match is found.
 */
export function useBreadcrumb() {
  const location = useLocation();

  return useMemo(() => {
    const findPath = (items: MenuItemConfig[]): MenuItemConfig[] | null => {
      for (const item of items) {
        if (item.path === location.pathname) return [item];
        if (item.children) {
          const found = findPath(item.children);
          if (found) return [item, ...found];
        }
      }
      return null;
    };

    const pathItems = findPath(MENU_CONFIG);
    if (pathItems) {
      // Keep only navigable items (skip pure group headers)
      return pathItems
        .filter((i) => i.type !== 'group')
        .map((i) => ({ title: i.label, path: i.path }));
    }

    return [{ title: 'Dashboard' }];
  }, [location.pathname]);
}
