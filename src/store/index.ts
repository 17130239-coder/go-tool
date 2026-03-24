import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  TOOL_DEFAULT_ORDER_PATHS,
  TOOL_PATH_SET,
  normalizeHiddenToolPaths,
  normalizeToolOrderPaths,
} from '../constants/menuConfig';
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

  // Sidebar tools customization
  hiddenToolPaths: string[];
  toolOrderPaths: string[];
  toggleToolVisibility: (path: string) => void;
  moveToolOrderPath: (path: string, direction: 'up' | 'down') => void;
  setToolOrderPaths: (paths: string[]) => void;
  resetSidebarToolPreferences: () => void;
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

      // Sidebar tools customization
      hiddenToolPaths: [],
      toolOrderPaths: [...TOOL_DEFAULT_ORDER_PATHS],
      toggleToolVisibility: (path) =>
        set((state) => {
          if (!TOOL_PATH_SET.has(path)) {
            return state;
          }

          const nextHiddenPaths = state.hiddenToolPaths.includes(path)
            ? state.hiddenToolPaths.filter((item) => item !== path)
            : [...state.hiddenToolPaths, path];

          return {
            hiddenToolPaths: normalizeHiddenToolPaths(nextHiddenPaths),
          };
        }),
      moveToolOrderPath: (path, direction) =>
        set((state) => {
          if (!TOOL_PATH_SET.has(path)) {
            return state;
          }

          const ordered = normalizeToolOrderPaths(state.toolOrderPaths);
          const currentIndex = ordered.indexOf(path);
          if (currentIndex < 0) {
            return state;
          }

          const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
          if (targetIndex < 0 || targetIndex >= ordered.length) {
            return state;
          }

          const nextOrdered = [...ordered];
          const [moved] = nextOrdered.splice(currentIndex, 1);
          nextOrdered.splice(targetIndex, 0, moved);

          return {
            toolOrderPaths: nextOrdered,
          };
        }),
      setToolOrderPaths: (paths) =>
        set({
          toolOrderPaths: normalizeToolOrderPaths(paths),
        }),
      resetSidebarToolPreferences: () =>
        set({
          hiddenToolPaths: [],
          toolOrderPaths: [...TOOL_DEFAULT_ORDER_PATHS],
        }),
    }),
    {
      name: 'go-tool-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
        favoriteToolPaths: state.favoriteToolPaths,
        recentToolUsage: state.recentToolUsage,
        hiddenToolPaths: state.hiddenToolPaths,
        toolOrderPaths: state.toolOrderPaths,
      }),
    },
  ),
);
