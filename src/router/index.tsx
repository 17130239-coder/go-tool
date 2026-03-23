import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
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
          const { DashboardPage } = await import('../features/dashboard');
          return { Component: DashboardPage };
        },
      },
      {
        path: 'naming-converter',
        errorElement: <PageError />,
        lazy: async () => {
          const { ConverterPage } = await import('../features/naming-converter');
          return { Component: ConverterPage };
        },
      },
      {
        path: 'random-number',
        errorElement: <PageError />,
        lazy: async () => {
          const { RandomNumberPage } = await import('../features/random-number');
          return { Component: RandomNumberPage };
        },
      },
      {
        path: 'random-color',
        errorElement: <PageError />,
        lazy: async () => {
          const { ColorConverterPage } = await import('../features/random-color');
          return { Component: ColorConverterPage };
        },
      },
      {
        path: 'text-typing',
        errorElement: <PageError />,
        lazy: async () => {
          const { TextTypingPage } = await import('../features/text-typing');
          return { Component: TextTypingPage };
        },
      },
      {
        path: 'json-formatter',
        errorElement: <PageError />,
        lazy: async () => {
          const { JsonFormatterPage } = await import('../features/json-formatter');
          return { Component: JsonFormatterPage };
        },
      },
      {
        path: 'sql-formatter',
        errorElement: <PageError />,
        lazy: async () => {
          const { SqlFormatterPage } = await import('../features/sql-formatter');
          return { Component: SqlFormatterPage };
        },
      },
      {
        path: 'gross-net-salary',
        errorElement: <PageError />,
        lazy: async () => {
          const { GrossNetSalaryPage } = await import('../features/gross-net-salary');
          return { Component: GrossNetSalaryPage };
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
