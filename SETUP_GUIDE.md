# Project Setup Guide

A step-by-step guide to scaffold a new React + TypeScript project with this architecture.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 8 |
| UI Library | Ant Design 6 |
| Routing | React Router DOM 7 (lazy routes) |
| State | Zustand 5 (persisted) |
| Server State | TanStack Query 5 |
| HTTP Client | Axios |
| CSS | Vanilla CSS + CSS Modules |
| Linting | ESLint 9 (flat config) + Prettier 3 |
| Git Hooks | Husky 9 + lint-staged + Commitlint |

---

## Step 1: Scaffold

```bash
pnpm create vite@latest my-app -- --template react-ts
cd my-app
```

## Step 2: Install Dependencies

```bash
# Runtime
pnpm add react react-dom react-router-dom
pnpm add antd @ant-design/icons
pnpm add zustand @tanstack/react-query axios
pnpm add clsx dayjs

# Dev
pnpm add -D prettier eslint-plugin-import eslint-plugin-jsx-a11y
pnpm add -D eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint globals
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm add -D @types/node
```

## Step 3: TypeScript Config

**`tsconfig.json`** (project references root):
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**`tsconfig.app.json`**:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**`tsconfig.node.json`**:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

## Step 4: ESLint

**`eslint.config.js`**:
```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);
```

## Step 5: Prettier

**`.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## Step 6: Git Hooks

```bash
git init && pnpm exec husky init
```

**`.husky/pre-commit`**: `pnpm exec lint-staged`
**`.husky/commit-msg`**: `pnpm exec commitlint --edit $1`

**`commitlint.config.cjs`**:
```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

Add to **`package.json`**:
```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md}": ["prettier --write"]
}
```

## Step 7: Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
  "prepare": "husky"
}
```

---

## Source Structure

```
src/
├── api/                    # Axios client
├── assets/                 # Static images, SVGs
├── components/
│   ├── layout/             # App shell (MainLayout, Sidebar, Header)
│   ├── shared/             # Reusable UI (barrel-exported via index.ts)
│   └── ui/                 # Low-level primitives (PageLoader, PageError, PageEmpty)
├── constants/              # App-wide constants, menu config
├── features/               # Feature modules (see convention below)
├── hooks/                  # Shared hooks (barrel-exported via index.ts)
├── router/                 # createBrowserRouter with lazy routes
├── store/                  # Zustand store with persist middleware
├── styles/                 # Utility CSS (spacing helpers, etc.)
├── types/                  # Global TypeScript types
├── App.tsx                 # Root (ConfigProvider + QueryClient + Router)
├── App.css                 # Global app styles
├── main.tsx                # Entry point
└── index.css               # CSS reset / base styles
```

### Barrel Exports

`hooks/index.ts` and `components/shared/index.ts` use `export * from './...'` for clean imports:
```ts
// src/hooks/index.ts
export * from './useCopyToClipboard';
export * from './usePageTitle';
```

> **Feature modules do NOT use barrel exports** — always import the specific file.

---

## Feature Module Convention

Each feature lives in `src/features/{feature-name}/`:

```
src/features/my-feature/
├── MyFeaturePage.tsx       # Page component (named export, lazy-loaded)
├── MyFeatureType.ts        # Types and interfaces
├── MyFeatureConstant.ts    # Constants
├── MyFeatureUtil.ts        # Utility functions and pure logic
├── MyFeatureDoc.md         # Documentation
├── MyFeature.module.css    # Scoped styles (optional)
├── components/             # Feature-specific components
└── hooks/                  # Feature-specific hooks
```

**Rules:**
- No `index.ts` barrel files inside features
- Hooks and components stay nested in their subdirectories
- One `Page` file per feature — the lazy-loaded route entry point

---

## Router (Lazy Loading)

```tsx
// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PageError } from '../components/ui/PageError';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <PageError />,
    children: [
      { index: true, element: <Navigate to="/my-feature" replace /> },
      {
        path: 'my-feature',
        errorElement: <PageError />,
        lazy: async () => {
          const { MyFeaturePage } = await import('../features/my-feature/MyFeaturePage');
          return { Component: MyFeaturePage };
        },
      },
    ],
  },
]);
```

---

## Global State (Zustand)

```ts
// src/store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: AppState['themeMode']) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
```

---

## App Entry Point

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { useResolvedTheme } from './hooks';

const queryClient = new QueryClient();

export default function App() {
  const { resolvedTheme } = useResolvedTheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ConfigProvider
      theme={{ algorithm: resolvedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
```

---

## Vercel Deployment (Optional)

**`vercel.json`**:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Adding a New Feature — Checklist

1. Create `src/features/{feature-name}/`
2. Add: `{Feature}Page.tsx`, `{Feature}Type.ts`, `{Feature}Constant.ts`, `{Feature}Util.ts`, `{Feature}Doc.md`
3. Optionally add: `{Feature}.module.css`, `components/`, `hooks/`
4. Register a lazy route in `src/router/index.tsx`
5. Add a menu item in `src/constants/menuConfig.tsx`
6. Run `pnpm typecheck && pnpm build`

## Commit Convention

```
feat(feature): add new page
fix(router): resolve lazy load error
refactor(store): simplify state
chore: update dependencies
```
