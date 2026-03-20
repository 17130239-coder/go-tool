import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { findNavigableItemByPath } from '../constants/menuConfig';

const APP_TITLE = 'Go Tool';

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const currentPage = findNavigableItemByPath(location.pathname);
    document.title = currentPage ? `${currentPage.label} · ${APP_TITLE}` : APP_TITLE;
  }, [location.pathname]);
}
