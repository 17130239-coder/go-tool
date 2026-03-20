import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemeMode, ToolUsageEntry } from '../types';

interface AppState {
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Tools experience
  favoriteToolPaths: string[];
  recentToolUsage: ToolUsageEntry[];
  toggleFavoriteTool: (path: string) => void;
  recordToolUsage: (path: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Tools experience
      favoriteToolPaths: [],
      recentToolUsage: [],
      toggleFavoriteTool: (path) =>
        set((state) => {
          const isFavorite = state.favoriteToolPaths.includes(path);
          return {
            favoriteToolPaths: isFavorite
              ? state.favoriteToolPaths.filter((item) => item !== path)
              : [...state.favoriteToolPaths, path],
          };
        }),
      recordToolUsage: (path) =>
        set((state) => {
          const filtered = state.recentToolUsage.filter((item) => item.path !== path);
          const nextUsage: ToolUsageEntry = { path, usedAt: Date.now() };
          return {
            recentToolUsage: [nextUsage, ...filtered].slice(0, 12),
          };
        }),
    }),
    {
      name: 'go-tool-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
        favoriteToolPaths: state.favoriteToolPaths,
        recentToolUsage: state.recentToolUsage,
      }),
    },
  ),
);
