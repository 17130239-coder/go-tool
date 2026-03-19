import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ConverterPage } from '../features/naming-converter';
import { ColorConverterPage } from '../features/random-color';
import { RandomNumberPage } from '../features/random-number';
import { TextTypingPage } from '../features/text-typing';
import { JsonFormatterPage } from '../features/json-formatter';
import { PageError } from '../components/ui/PageError';

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
        element: <div>Dashboard Content Placeholder</div>,
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
        path: 'categories',
        element: <div>Categories Placeholder</div>,
      },
      {
        path: 'permissions',
        element: <div>Permissions Placeholder</div>,
      },
      {
        path: '*',
        element: <PageError message="Page not found" />,
      },
    ],
  },
]);
