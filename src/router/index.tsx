import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HiddenToolRouteGuard } from '../components/layout/HiddenToolRouteGuard';
import { PageError } from '../components/ui/PageError';
import { buildRoutes } from '../utils/menuUtil';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <PageError />,
    children: buildRoutes(HiddenToolRouteGuard, PageError),
  },
]);
