/**
 * Global application store (Zustand + persist middleware).
 *
 * Persists selected keys to localStorage under the key 'go-tool-storage'.
 * Uses `partialize` so only the listed fields are persisted — actions are never stored.
 *
 * Sections:
 *  1. Theme         — light/dark/system preference
 *  2. Sidebar       — collapsed state
 *  3. Tools UX      — favorites and recent usage tracking
 *  4. Sidebar Tools — custom tool ordering and visibility
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  TOOL_DEFAULT_ORDER_PATHS,
  TOOL_PATH_SET,
} from '../constants/menuConfig';
import {
  normalizeHiddenToolPaths,
  normalizeToolOrderPaths,
} from '../utils/menuUtil';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** User theme preference. 'system' defers to the OS media query. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** A single entry in the recent-usage history. */
export interface ToolUsageEntry {
  path: string;
  /** Epoch timestamp (ms) of the last visit. */
  usedAt: number;
}

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface AppState {
  // -- Theme --
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // -- Sidebar --
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // -- Tools UX --
  favoriteToolPaths: string[];
  recentToolUsage: ToolUsageEntry[];
  toggleFavoriteTool: (path: string) => void;
  recordToolUsage: (path: string) => void;

  // -- Sidebar tools customisation --
  hiddenToolPaths: string[];
  toolOrderPaths: string[];
  toggleToolVisibility: (path: string) => void;
  moveToolOrderPath: (path: string, direction: 'up' | 'down') => void;
  setToolOrderPaths: (paths: string[]) => void;
  resetSidebarToolPreferences: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

/** Maximum number of recent-usage entries kept in state. */
const MAX_RECENT_USAGE = 12;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ── Theme ────────────────────────────────────────────────────────
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),

      // ── Sidebar ──────────────────────────────────────────────────────
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // ── Tools UX ─────────────────────────────────────────────────────
      favoriteToolPaths: [],
      recentToolUsage: [],

      /** Toggle a tool path in/out of the favorites list. */
      toggleFavoriteTool: (path) =>
        set((state) => {
          const isFavorite = state.favoriteToolPaths.includes(path);
          return {
            favoriteToolPaths: isFavorite
              ? state.favoriteToolPaths.filter((p) => p !== path)
              : [...state.favoriteToolPaths, path],
          };
        }),

      /**
       * Record a tool visit.
       * Moves the entry to the front and caps the list at MAX_RECENT_USAGE.
       */
      recordToolUsage: (path) =>
        set((state) => {
          const filtered = state.recentToolUsage.filter((e) => e.path !== path);
          const entry: ToolUsageEntry = { path, usedAt: Date.now() };
          return {
            recentToolUsage: [entry, ...filtered].slice(0, MAX_RECENT_USAGE),
          };
        }),

      // ── Sidebar tools customisation ──────────────────────────────────
      hiddenToolPaths: [],
      toolOrderPaths: [...TOOL_DEFAULT_ORDER_PATHS],

      /** Show/hide a tool in the sidebar. Ignores paths not in TOOL_PATH_SET. */
      toggleToolVisibility: (path) =>
        set((state) => {
          if (!TOOL_PATH_SET.has(path)) return state;

          const isHidden = state.hiddenToolPaths.includes(path);
          const nextHidden = isHidden
            ? state.hiddenToolPaths.filter((p) => p !== path)
            : [...state.hiddenToolPaths, path];

          return { hiddenToolPaths: normalizeHiddenToolPaths(nextHidden) };
        }),

      /** Swap a tool one position up or down in the sidebar ordering. */
      moveToolOrderPath: (path, direction) =>
        set((state) => {
          if (!TOOL_PATH_SET.has(path)) return state;

          const ordered = normalizeToolOrderPaths(state.toolOrderPaths);
          const currentIndex = ordered.indexOf(path);
          if (currentIndex < 0) return state;

          const targetIndex =
            direction === 'up' ? currentIndex - 1 : currentIndex + 1;
          if (targetIndex < 0 || targetIndex >= ordered.length) return state;

          // Swap the two elements
          const next = [...ordered];
          [next[currentIndex], next[targetIndex]] = [
            next[targetIndex],
            next[currentIndex],
          ];

          return { toolOrderPaths: next };
        }),

      setToolOrderPaths: (paths) =>
        set({ toolOrderPaths: normalizeToolOrderPaths(paths) }),

      /** Reset hiding and ordering back to the defaults. */
      resetSidebarToolPreferences: () =>
        set({
          hiddenToolPaths: [],
          toolOrderPaths: [...TOOL_DEFAULT_ORDER_PATHS],
        }),
    }),
    {
      name: 'go-tool-storage',
      /**
       * Only persist primitive / serialisable state.
       * Actions are never stored — they are re-created by Zustand on load.
       */
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
