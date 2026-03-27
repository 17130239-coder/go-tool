import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HiddenToolRouteGuard } from '../components/router/HiddenToolRouteGuard';
import { PageError } from '../components/ui/PageError';
import { Card, Empty, Flex } from 'antd';

function renderPlaceholder(description: string) {
  return (
    <Card>
      <Flex justify="center" className="py-32">
        <Empty description={description} />
      </Flex>
    </Card>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        errorElement: <PageError />,
        lazy: async () => {
          const { DashboardPage } = await import('../features/dashboard/DashboardPage');
          return { Component: DashboardPage };
        },
      },
      {
        path: 'naming-converter',
        errorElement: <PageError />,
        lazy: async () => {
          const { ConverterPage } = await import('../features/naming-converter/NamingConverterPage');
          return {
            Component: () => (
              <HiddenToolRouteGuard>
                <ConverterPage />
              </HiddenToolRouteGuard>
            ),
          };
        },
      },
      {
        path: 'random-number',
        errorElement: <PageError />,
        lazy: async () => {
          const { RandomNumberPage } = await import('../features/random-number/RandomNumberPage');
          return {
            Component: () => (
              <HiddenToolRouteGuard>
                <RandomNumberPage />
              </HiddenToolRouteGuard>
            ),
          };
        },
      },
      {
        path: 'random-color',
        errorElement: <PageError />,
        lazy: async () => {
          const { ColorConverterPage } = await import('../features/random-color/RandomColorPage');
          return {
            Component: () => (
              <HiddenToolRouteGuard>
                <ColorConverterPage />
              </HiddenToolRouteGuard>
            ),
          };
        },
      },
      {
        path: 'text-typing',
        errorElement: <PageError />,
        lazy: async () => {
          const { TextTypingPage } = await import('../features/text-typing/TextTypingPage');
          return {
            Component: () => (
              <HiddenToolRouteGuard>
                <TextTypingPage />
              </HiddenToolRouteGuard>
            ),
          };
        },
      },
      {
        path: 'json-formatter',
        errorElement: <PageError />,
        lazy: async () => {
          const { JsonFormatterPage } = await import('../features/json-formatter/JsonFormatterPage');
          return {
            Component: () => (
              <HiddenToolRouteGuard>
                <JsonFormatterPage />
              </HiddenToolRouteGuard>
            ),
          };
        },
      },
      {
        path: 'sql-formatter',
        errorElement: <PageError />,
        lazy: async () => {
          const { SqlFormatterPage } = await import('../features/sql-formatter/SqlFormatterPage');
          return {
            Component: () => (
              <HiddenToolRouteGuard>
                <SqlFormatterPage />
              </HiddenToolRouteGuard>
            ),
          };
        },
      },
      {
        path: 'gross-net-salary',
        errorElement: <PageError />,
        lazy: async () => {
          const { GrossNetSalaryPage } = await import('../features/gross-net-salary/GrossNetSalaryPage');
          return {
            Component: () => (
              <HiddenToolRouteGuard>
                <GrossNetSalaryPage />
              </HiddenToolRouteGuard>
            ),
          };
        },
      },
      {
        path: 'settings/sidebar',
        errorElement: <PageError />,
        lazy: async () => {
          const { SidebarSettingsPage } = await import('../features/sidebar-settings/SidebarSettingsPage');
          return { Component: SidebarSettingsPage };
        },
      },
      {
        path: 'categories',
        element: renderPlaceholder('Categories module is coming soon.'),
      },
      {
        path: 'permissions',
        element: renderPlaceholder('Permissions module is coming soon.'),
      },
      {
        path: '*',
        element: <PageError message="Page not found" />,
      },
    ],
  },
]);
