import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import type { ThemeMode } from '../store';

const getSystemTheme = (): Exclude<ThemeMode, 'system'> =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function useResolvedTheme() {
  const themeMode = useAppStore((state) => state.themeMode);
  const [systemTheme, setSystemTheme] = useState<Exclude<ThemeMode, 'system'>>(getSystemTheme);

  useEffect(() => {
    if (themeMode !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, [themeMode]);

  const resolvedTheme = useMemo<Exclude<ThemeMode, 'system'>>(
    () => (themeMode === 'system' ? systemTheme : themeMode),
    [systemTheme, themeMode],
  );

  return { themeMode, resolvedTheme };
}
