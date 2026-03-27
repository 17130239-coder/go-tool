import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { TOOL_PATH_SET } from '../../constants/menuConfig';
import { normalizeHiddenToolPaths } from '../../utils/menuUtil';
import { useAppStore } from '../../store';

interface HiddenToolRouteGuardProps {
  children: ReactNode;
}

/**
 * Route guard that prevents access to hidden tool pages.
 *
 * If the current path is a tool AND the user has hidden it via sidebar settings,
 * the guard redirects to `/dashboard`. Otherwise it renders `children` as-is.
 */
export function HiddenToolRouteGuard({ children }: HiddenToolRouteGuardProps) {
  const location = useLocation();
  const hiddenToolPaths = useAppStore((state) => state.hiddenToolPaths);

  const normalizedHiddenPaths = normalizeHiddenToolPaths(hiddenToolPaths);
  const isToolRoute = TOOL_PATH_SET.has(location.pathname);
  const isHidden = isToolRoute && normalizedHiddenPaths.includes(location.pathname);

  if (isHidden) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
