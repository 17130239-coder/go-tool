import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemeMode } from '../types';

interface AppState {
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
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
    }),
    {
      name: 'go-tool-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
