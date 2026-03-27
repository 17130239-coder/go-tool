import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { findNavigableItemByPath } from '../utils/menuUtil';
import { APP_TITLE } from '../constants/appConfig';

/**
 * Synchronises `document.title` with the current route.
 *
 * On every pathname change, looks up the matching menu item and sets
 * `document.title` to `"Page Label · Go Tool"`. Falls back to just the
 * app title when no match is found (e.g. 404 pages).
 */
export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const currentPage = findNavigableItemByPath(location.pathname);
    document.title = currentPage
      ? `${currentPage.label} · ${APP_TITLE}`
      : APP_TITLE;
  }, [location.pathname]);
}
