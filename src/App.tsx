/**
 * Root application component.
 *
 * Provides the global context stack:
 *  1. Ant Design `ConfigProvider` (theme algorithm based on resolved theme)
 *  2. TanStack `QueryClientProvider` (for server state — ready to use)
 *  3. React Router `RouterProvider`
 *
 * Also synchronises the favicon with the current theme.
 */

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { useResolvedTheme } from './hooks';
import { ASSETS } from './constants/appConfig';

const queryClient = new QueryClient();

function App() {
  const { resolvedTheme } = useResolvedTheme();

  // Sync body data-theme attribute and favicon with the current theme
  useEffect(() => {
    document.body.setAttribute('data-theme', resolvedTheme);

    const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (faviconLink) {
      faviconLink.href = ASSETS.favicon[resolvedTheme];
    }
  }, [resolvedTheme]);

  return (
    <ConfigProvider
      theme={{
        algorithm: resolvedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
