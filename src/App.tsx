import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { useResolvedTheme } from './hooks';

const queryClient = new QueryClient();

function App() {
  const { resolvedTheme } = useResolvedTheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', resolvedTheme);

    const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (faviconLink) {
      faviconLink.href = resolvedTheme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    }
  }, [resolvedTheme]);

  const getAntThemeAlgorithm = () => {
    if (resolvedTheme === 'dark') return theme.darkAlgorithm;
    return theme.defaultAlgorithm;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: getAntThemeAlgorithm(),
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
