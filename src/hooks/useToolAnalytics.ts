import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TOOL_PATH_SET } from '../constants/menuConfig';
import { useAppStore } from '../store';

export function useToolAnalytics() {
  const location = useLocation();
  const recordToolUsage = useAppStore((state) => state.recordToolUsage);

  useEffect(() => {
    if (TOOL_PATH_SET.has(location.pathname)) {
      recordToolUsage(location.pathname);
    }
  }, [location.pathname, recordToolUsage]);
}
