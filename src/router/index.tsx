import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PageError } from '../components/ui/PageError';
import { Card, Empty, Flex } from 'antd';
import { PageLoader } from '../components/ui/PageLoader';
import {
  ColorConverterPage,
  ConverterPage,
  DashboardPage,
  GrossNetSalaryPage,
  JsonFormatterPage,
  RandomNumberPage,
  SqlFormatterPage,
  TextTypingPage,
} from './lazyPages';

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
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'naming-converter',
        element: <ConverterPage />,
      },
      {
        path: 'random-number',
        element: <RandomNumberPage />,
      },
      {
        path: 'random-color',
        element: <ColorConverterPage />,
      },
      {
        path: 'text-typing',
        element: <TextTypingPage />,
      },
      {
        path: 'json-formatter',
        element: <JsonFormatterPage />,
      },
      {
        path: 'sql-formatter',
        element: <SqlFormatterPage />,
      },
      {
        path: 'gross-net-salary',
        element: <GrossNetSalaryPage />,
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
