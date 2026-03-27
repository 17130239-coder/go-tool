import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import type { ThemeMode } from '../store';

/** Reads the OS-level dark/light preference via `prefers-color-scheme`. */
const getSystemTheme = (): Exclude<ThemeMode, 'system'> =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/**
 * Resolves the effective theme (`'light'` | `'dark'`) from the user's preference.
 *
 * When `themeMode` is `'system'`, listens for OS-level `prefers-color-scheme` changes
 * and updates reactively. Returns both the raw `themeMode` and the `resolvedTheme`.
 */
export function useResolvedTheme() {
  const themeMode = useAppStore((state) => state.themeMode);
  const [systemTheme, setSystemTheme] =
    useState<Exclude<ThemeMode, 'system'>>(getSystemTheme);

  // Subscribe to OS theme changes only when in "system" mode
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () =>
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const resolvedTheme = useMemo<Exclude<ThemeMode, 'system'>>(
    () => (themeMode === 'system' ? systemTheme : themeMode),
    [systemTheme, themeMode],
  );

  return { themeMode, resolvedTheme };
}
