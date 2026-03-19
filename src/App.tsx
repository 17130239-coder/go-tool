import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { useAppStore } from './store';

const queryClient = new QueryClient();

function App() {
  const themeMode = useAppStore((state) => state.themeMode);
  
  // Handle 'system' theme preference listener
  useEffect(() => {
    if (themeMode !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    
    document.body.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Handle explicit light/dark body attributes
  useEffect(() => {
    if (themeMode !== 'system') {
      document.body.setAttribute('data-theme', themeMode);
    }
  }, [themeMode]);

  const getAntThemeAlgorithm = () => {
    if (themeMode === 'dark') return theme.darkAlgorithm;
    if (themeMode === 'light') return theme.defaultAlgorithm;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? theme.darkAlgorithm
      : theme.defaultAlgorithm;
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
