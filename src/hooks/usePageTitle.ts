import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { findNavigableItemByPath } from '../constants/menuConfig';
import { APP_TITLE } from '../constants/appConfig';

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const currentPage = findNavigableItemByPath(location.pathname);
    document.title = currentPage ? `${currentPage.label} · ${APP_TITLE}` : APP_TITLE;
  }, [location.pathname]);
}
