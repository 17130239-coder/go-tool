import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MENU_CONFIG } from '../constants/menuConfig';
import type { MenuItemConfig } from '../constants/menuConfig';

export function useBreadcrumb() {
  const location = useLocation();

  return useMemo(() => {
    const defaultTitle = 'Dashboard';
    const findPath = (items: MenuItemConfig[]): MenuItemConfig[] | null => {
      for (const item of items) {
        if (item.path === location.pathname) {
          return [item];
        }
        if (item.children) {
          const found = findPath(item.children);
          if (found) {
            return [item, ...found];
          }
        }
      }
      return null;
    };

    const pathItems = findPath(MENU_CONFIG);
    if (pathItems) {
      // Filter out pure groups, only keep submenus/items
      return pathItems
        .filter((i) => i.type !== 'group')
        .map((i) => ({ title: i.label, path: i.path }));
    }
    
    return [{ title: defaultTitle }];
  }, [location.pathname]);
}
