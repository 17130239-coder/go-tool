import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { TOOL_PATH_SET } from '../../constants/menuConfig';
import { normalizeHiddenToolPaths } from '../../utils/menuUtil';
import { useAppStore } from '../../store';

interface HiddenToolRouteGuardProps {
  children: ReactNode;
}

export function HiddenToolRouteGuard({ children }: HiddenToolRouteGuardProps) {
  const location = useLocation();
  const hiddenToolPaths = useAppStore((state) => state.hiddenToolPaths);

  const normalizedHiddenPaths = normalizeHiddenToolPaths(hiddenToolPaths);
  const isToolRoute = TOOL_PATH_SET.has(location.pathname);
  const isHiddenToolRoute = isToolRoute && normalizedHiddenPaths.includes(location.pathname);

  if (isHiddenToolRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
