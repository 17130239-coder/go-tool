import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ConverterPage } from '../features/naming-converter';
import { ColorConverterPage } from '../features/random-color';
import { RandomNumberPage } from '../features/random-number';
import { TextTypingPage } from '../features/text-typing';
import { JsonFormatterPage } from '../features/json-formatter';
import { SqlFormatterPage } from '../features/sql-formatter';
import { GrossNetSalaryPage } from '../features/gross-net-salary';
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
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: renderPlaceholder('Dashboard is coming soon.'),
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
